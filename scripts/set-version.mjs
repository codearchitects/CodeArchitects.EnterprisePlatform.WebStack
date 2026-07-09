#!/usr/bin/env node
// Sets a single shared version across every workspace package and pins all
// internal (workspace) dependencies to that exact version.
//
// Usage: node scripts/set-version.mjs <version>
// Example: node scripts/set-version.mjs 21.1.0
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const version = process.argv[2];
if (!version) {
  console.error("Usage: node scripts/set-version.mjs <version>");
  process.exit(1);
}

// Discover workspace package directories (ca-*, caep-*) that contain a package.json.
const dirs = readdirSync(root, { withFileTypes: true })
  .filter((d) => d.isDirectory() && /^(ca|caep)-/.test(d.name))
  .map((d) => join(root, d.name))
  .filter((p) => existsSync(join(p, "package.json")));

// First pass: collect all workspace package names.
const pkgs = dirs.map((dir) => {
  const file = join(dir, "package.json");
  return { dir, file, json: JSON.parse(readFileSync(file, "utf8")) };
});
const names = new Set(pkgs.map((p) => p.json.name));

// Second pass: set version + pin internal deps.
for (const { file, json } of pkgs) {
  json.version = version;
  for (const field of ["dependencies", "peerDependencies", "devDependencies", "optionalDependencies"]) {
    const deps = json[field];
    if (!deps) continue;
    for (const dep of Object.keys(deps)) {
      if (names.has(dep)) deps[dep] = version;
    }
  }
  writeFileSync(file, JSON.stringify(json, null, 2) + "\n");
  console.log(`  ${json.name} -> ${version}`);
}

// Also bump the (private) root package version so it stays the single source of
// truth for the "current" released version — used by scripts/release-version.mjs
// to compute the next bump. The root has no internal deps to pin.
const rootFile = join(root, "package.json");
const rootJson = JSON.parse(readFileSync(rootFile, "utf8"));
if (rootJson.version !== version) {
  rootJson.version = version;
  writeFileSync(rootFile, JSON.stringify(rootJson, null, 2) + "\n");
  console.log(`  ${rootJson.name} (root) -> ${version}`);
}

console.log(`\nSet ${pkgs.length} packages (+ root) to ${version}.`);
