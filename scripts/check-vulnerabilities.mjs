#!/usr/bin/env node
// Fails if the *shipped* dependency graph (production deps of every workspace
// package — what consumers actually install) contains a vulnerability that is
// not on the allow-list.
//
// Dev/build-tooling advisories (Angular CLI dev-server, webpack, karma, esbuild,
// …) never reach consumers, so they are reported informationally but do not gate.
//
// Allow-list: .github/allowed-advisories.txt — one GHSA id per line, `#` comments.
// This is the single source of truth; document each accepted advisory in SECURITY.md.
//
// Usage: node scripts/check-vulnerabilities.mjs
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const allowFile = join(root, ".github", "allowed-advisories.txt");

const accepted = new Set(
  (existsSync(allowFile) ? readFileSync(allowFile, "utf8") : "")
    .split("\n")
    .map((l) => l.replace(/#.*$/, "").trim().toUpperCase())
    .filter((l) => /^GHSA-/.test(l))
);

// `npm audit` exits non-zero when it finds anything; capture output regardless.
let raw = "{}";
try {
  raw = execSync("npm audit --omit=dev --json", { cwd: root, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
} catch (e) {
  raw = e.stdout?.toString() || "{}";
}

const audit = JSON.parse(raw);
const found = new Map(); // GHSA -> {severity, module, title}
for (const [name, v] of Object.entries(audit.vulnerabilities || {})) {
  for (const via of v.via || []) {
    if (typeof via !== "object" || !via.url) continue;
    const m = /GHSA-[0-9a-z]+-[0-9a-z]+-[0-9a-z]+/i.exec(via.url);
    if (m) found.set(m[0].toUpperCase(), { severity: via.severity || v.severity, module: name, title: via.title || "" });
  }
}

const unexpected = [...found.keys()].filter((id) => !accepted.has(id)).sort();

console.log(`Shipped-dependency advisories found: ${found.size} | accepted: ${accepted.size} | unexpected: ${unexpected.length}`);
for (const id of unexpected) {
  const info = found.get(id);
  console.log(`  ${id}  [${info.severity}]  ${info.module} — ${info.title}`);
}

if (unexpected.length > 0) {
  console.error(
    "\n::error::Unaccepted vulnerabilities in shipped (production) dependencies.\n" +
      "Fix the dependency, or (if no fix exists) add the advisory to " +
      ".github/allowed-advisories.txt with a documented rationale in SECURITY.md."
  );
  process.exit(1);
}
console.log("OK: no unaccepted vulnerabilities in shipped dependencies.");
