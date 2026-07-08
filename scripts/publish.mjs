#!/usr/bin/env node
// Publishes every workspace package to npm from its built `dist` manifest.
//
// Assumes `npm run build` has already run (dist/ folders exist). The publishable
// artifact for every package is the generated manifest under its dist directory
// (ng-packagr / webpack both emit a self-contained package.json there).
//
// Usage:
//   node scripts/publish.mjs [--tag <dist-tag>] [--access public|restricted] [--dry-run]
//
// Auth: relies on npm being authenticated (e.g. NODE_AUTH_TOKEN + .npmrc in CI).
import { readFileSync, readdirSync, existsSync, statSync, copyFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const argv = process.argv.slice(2);
const getOpt = (name, def) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : def;
};
const tag = getOpt("--tag", "latest");
const access = getOpt("--access", "public");
const dryRun = argv.includes("--dry-run");

// Locate a package's built manifest: the package.json under dist/ (max depth 2)
// whose "name" matches the source package name.
function findDistManifest(pkgDir, expectedName) {
  const distDir = join(pkgDir, "dist");
  if (!existsSync(distDir)) return null;
  const candidates = [distDir, ...readdirSync(distDir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => join(distDir, e.name))];
  for (const dir of candidates) {
    const manifest = join(dir, "package.json");
    if (existsSync(manifest)) {
      try {
        if (JSON.parse(readFileSync(manifest, "utf8")).name === expectedName) return dir;
      } catch { /* ignore malformed */ }
    }
  }
  return null;
}

const pkgDirs = readdirSync(root, { withFileTypes: true })
  .filter((d) => d.isDirectory() && /^(ca|caep)-/.test(d.name))
  .map((d) => join(root, d.name))
  .filter((p) => existsSync(join(p, "package.json")) && !JSON.parse(readFileSync(join(p, "package.json"), "utf8")).private);

const published = [];
const skipped = [];
const missing = [];

for (const pkgDir of pkgDirs) {
  const src = JSON.parse(readFileSync(join(pkgDir, "package.json"), "utf8"));
  const distDir = findDistManifest(pkgDir, src.name);
  if (!distDir) {
    missing.push(src.name);
    console.error(`✗ ${src.name}: no built dist manifest found (did you run the build?)`);
    continue;
  }
  const dist = JSON.parse(readFileSync(join(distDir, "package.json"), "utf8"));

  // Idempotency: skip if this exact version is already on the registry.
  let alreadyPublished = false;
  try {
    const view = execFileSync("npm", ["view", `${dist.name}@${dist.version}`, "version"], {
      stdio: ["ignore", "pipe", "ignore"],
    }).toString().trim();
    alreadyPublished = view === dist.version;
  } catch { /* not published yet */ }

  if (alreadyPublished) {
    skipped.push(`${dist.name}@${dist.version}`);
    console.log(`• skip ${dist.name}@${dist.version} (already on registry)`);
    continue;
  }

  // Ensure every published package carries the project license and notice.
  for (const file of ["LICENSE", "NOTICE"]) {
    const srcFile = join(root, file);
    if (existsSync(srcFile)) copyFileSync(srcFile, join(distDir, file));
  }

  const args = ["publish", distDir, "--access", access, "--tag", tag];
  if (dryRun) args.push("--dry-run");
  console.log(`→ npm ${args.join(" ")}`);
  execFileSync("npm", args, { stdio: "inherit" });
  published.push(`${dist.name}@${dist.version}`);
}

console.log(`\nPublished: ${published.length}  |  Skipped: ${skipped.length}  |  Missing: ${missing.length}`);
if (missing.length) {
  console.error("Missing built manifests for: " + missing.join(", "));
  process.exit(1);
}
