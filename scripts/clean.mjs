#!/usr/bin/env node
// Full reset: removes node_modules, the root lockfile, the turbo cache and every
// package's build artifacts (dist, .tmp, typedocs). Does not require turbo to be
// installed, so it works even from a half-broken state.
import { rmSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const targets = [join(root, "node_modules"), join(root, ".turbo")];

for (const dir of readdirSync(root, { withFileTypes: true })) {
  if (dir.isDirectory() && /^(ca|caep)-/.test(dir.name)) {
    const pkg = join(root, dir.name);
    targets.push(
      join(pkg, "node_modules"),
      join(pkg, "dist"),
      join(pkg, ".tmp"),
      join(pkg, "typedocs")
    );
  }
}

for (const t of targets) {
  if (existsSync(t)) {
    rmSync(t, { recursive: true, force: true });
    console.log(`  removed ${t.replace(root + "/", "")}`);
  }
}
console.log("\nClean complete. Run `npm run setup` to reinstall.");
