#!/usr/bin/env node
// Merges a package's custom `ngPackageExports` (from its source package.json)
// into the generated dist manifest's `exports` field.
//
// Why: ng-packagr owns the "." and "./package.json" export conditions and warns
// if the source package.json also declares them. But consumers inside the
// monorepo resolve a library through its *source* package.json (npm symlink), so
// a source `exports` field without "." would block the main entry import.
//
// Solution: keep custom subpath exports (e.g. sass) under the non-standard
// `ngPackageExports` key in source (ignored by ng-packagr and by resolution, so
// no warning and "." still resolves via module/typings), then re-inject them
// into the published dist manifest here, as a `build` post-step.
//
// Run from a package directory (npm `postbuild` sets cwd to the package root).
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const pkgDir = process.cwd();
const src = JSON.parse(readFileSync(join(pkgDir, "package.json"), "utf8"));
const extra = src.ngPackageExports;
if (!extra || Object.keys(extra).length === 0) {
  process.exit(0); // nothing to inject
}

// Locate the generated dist manifest (dist/, or a nested dest like dist/<name>).
function findDistManifest(name) {
  const distDir = join(pkgDir, "dist");
  if (!existsSync(distDir)) return null;
  const dirs = [distDir, ...readdirSync(distDir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => join(distDir, e.name))];
  for (const dir of dirs) {
    const f = join(dir, "package.json");
    if (existsSync(f)) {
      try {
        if (JSON.parse(readFileSync(f, "utf8")).name === name) return f;
      } catch { /* ignore */ }
    }
  }
  return null;
}

const manifest = findDistManifest(src.name);
if (!manifest) {
  console.error(`merge-pkg-exports: no built dist manifest for ${src.name}`);
  process.exit(1);
}

const dist = JSON.parse(readFileSync(manifest, "utf8"));
const merged = { ...(dist.exports || {}) };
for (const [subpath, conditions] of Object.entries(extra)) {
  // Merge conditions per subpath so custom ones (e.g. "sass") are added alongside
  // ng-packagr's generated ones (e.g. "types"/"default"), which win on conflict.
  merged[subpath] =
    merged[subpath] && typeof merged[subpath] === "object" && typeof conditions === "object"
      ? { ...conditions, ...merged[subpath] }
      : conditions;
}
dist.exports = merged;
writeFileSync(manifest, JSON.stringify(dist, null, 2) + "\n");
console.log(`merge-pkg-exports: injected ${Object.keys(extra).length} export entries into ${src.name} dist manifest`);
