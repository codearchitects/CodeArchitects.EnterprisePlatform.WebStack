#!/usr/bin/env node
// Generates timestamped security audit and SBOM reports in the reports/ directory.
// Overwrites the previous report (git tracks the history).
//
// Usage: node scripts/generate-security-report.mjs
// Or: npm run report:security
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const reportsDir = join(root, "reports");

// Ensure reports directory exists
["audit", "sbom", "vulnerabilities"].forEach((subdir) => {
  const dir = join(reportsDir, subdir);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
});

console.log("📊 Generating security reports...\n");

// 1. Shipped (production) dependencies audit
console.log("  • npm audit --omit=dev (shipped dependencies)");
try {
  const auditShipped = execSync("npm audit --omit=dev --json", {
    encoding: "utf8",
    cwd: root,
    stdio: ["ignore", "pipe", "ignore"],
  });
  writeFileSync(
    join(reportsDir, "audit", "audit-shipped.json"),
    auditShipped
  );
} catch (e) {
  // npm audit exits non-zero if it finds vulns; we want the output regardless
  if (e.stdout) {
    writeFileSync(
      join(reportsDir, "audit", "audit-shipped.json"),
      e.stdout.toString()
    );
  } else {
    console.error("    Error running npm audit --omit=dev:", e.message);
  }
}

// 2. Full audit (dev + build tooling)
console.log("  • npm audit (full, incl. dev/build tooling)");
try {
  const auditFull = execSync("npm audit --json", {
    encoding: "utf8",
    cwd: root,
    stdio: ["ignore", "pipe", "ignore"],
  });
  writeFileSync(join(reportsDir, "audit", "audit-full.json"), auditFull);
} catch (e) {
  if (e.stdout) {
    writeFileSync(
      join(reportsDir, "audit", "audit-full.json"),
      e.stdout.toString()
    );
  } else {
    console.error("    Error running npm audit:", e.message);
  }
}

// 3. SBOM (CycloneDX, shipped deps)
console.log("  • npm run sbom (CycloneDX)");
try {
  execSync(
    "npx --yes @cyclonedx/cyclonedx-npm@latest --omit dev --output-format JSON --output-file sbom.json",
    { cwd: root, stdio: "inherit" }
  );
  const sbom = execSync(
    "cat sbom.json",
    { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }
  );
  writeFileSync(join(reportsDir, "sbom", "sbom.json"), sbom);
} catch (e) {
  console.error("    Error generating SBOM:", e.message);
}

// 4. Vulnerabilities summary (from allowed-advisories.txt + shipped audit)
console.log("  • Vulnerabilities summary (allowed-advisories.txt)");
try {
  const auditShippedRaw = execSync("npm audit --omit=dev --json", {
    encoding: "utf8",
    cwd: root,
    stdio: ["ignore", "pipe", "ignore"],
  });
  const audit = JSON.parse(auditShippedRaw);

  // Collect all advisories from shipped deps
  const advisories = new Map();
  for (const [name, v] of Object.entries(audit.vulnerabilities || {})) {
    for (const via of v.via || []) {
      if (typeof via === "object" && via.url) {
        const m = /GHSA-[0-9a-z]+-[0-9a-z]+-[0-9a-z]+/i.exec(via.url);
        if (m) {
          const ghsa = m[0].toUpperCase();
          if (!advisories.has(ghsa)) {
            advisories.set(ghsa, {
              severity: via.severity || v.severity,
              module: name,
              title: via.title || "",
            });
          }
        }
      }
    }
  }

  // Read allowed-advisories.txt if it exists
  const allowFile = join(root, ".github", "allowed-advisories.txt");
  const accepted = new Set();
  if (existsSync(allowFile)) {
    const content = execSync(`cat "${allowFile}"`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    content
      .split("\n")
      .map((l) => l.replace(/#.*$/, "").trim().toUpperCase())
      .filter((l) => /^GHSA-/.test(l))
      .forEach((id) => accepted.add(id));
  }

  // Generate markdown summary
  const now = new Date().toISOString().split("T")[0];
  const summary = [
    "# Security Report",
    "",
    `Generated: ${now}`,
    "",
    "## Shipped Dependencies Vulnerabilities",
    "",
    `**Total found:** ${advisories.size} | **Accepted:** ${accepted.size}`,
    "",
  ];

  if (advisories.size === 0) {
    summary.push("✅ **No vulnerabilities detected in shipped dependencies.**");
  } else {
    summary.push("| GHSA | Severity | Module | Title |");
    summary.push("|------|----------|--------|-------|");
    for (const [ghsa, info] of advisories) {
      const status = accepted.has(ghsa) ? "✓ accepted" : "⚠️ unaccepted";
      summary.push(
        `| ${ghsa} | ${info.severity} | ${info.module} | ${info.title} (${status}) |`
      );
    }
  }

  summary.push("");
  summary.push("## Accepted Advisories");
  summary.push("");
  if (accepted.size === 0) {
    summary.push("_(none — see `.github/allowed-advisories.txt`)_");
  } else {
    summary.push("Rationales documented in `SECURITY.md`:");
    summary.push("");
    for (const id of [...accepted].sort()) {
      summary.push(`- ${id}`);
    }
  }

  writeFileSync(
    join(reportsDir, "vulnerabilities", "advisories.md"),
    summary.join("\n")
  );
} catch (e) {
  console.error("    Error generating summary:", e.message);
}

console.log("\n✅ Reports generated in reports/\n");
console.log("  audit/audit-shipped.json      (npm audit --omit=dev)");
console.log("  audit/audit-full.json         (npm audit, incl. dev tooling)");
console.log("  sbom/sbom.json                (CycloneDX)");
console.log("  vulnerabilities/advisories.md (summary with accept status)");
console.log("\nThese files are git-tracked. Review before commit.");
