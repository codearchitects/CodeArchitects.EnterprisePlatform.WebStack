#!/usr/bin/env node
// Computes release versions for the monorepo (single shared version).
//
// The root package.json version is the source of truth for the "current"
// released version. This script never writes anything — it only prints the
// result as JSON to stdout so the release workflow can consume it.
//
// Usage:
//   node scripts/release-version.mjs bump <type> [preid]
//       type  = major | minor | patch | premajor | preminor | prepatch | prerelease
//       preid = beta | rc | alpha | canary | next   (only used for pre* types)
//     -> { "current": "21.0.0", "next": "21.1.0-beta.0", "distTag": "beta" }
//
//   node scripts/release-version.mjs tag <version>
//     -> { "current": "<version>", "next": "<version>", "distTag": "latest|<preid>" }
//
// The npm dist-tag is derived from the resulting version: a stable version maps
// to "latest"; a pre-release (e.g. 21.1.0-beta.0) maps to its identifier
// ("beta"). This keeps `npm install <pkg>` on stable and requires an explicit
// `npm install <pkg>@beta` (or @canary, @next, ...) to opt into pre-releases.
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const semver = require("semver");

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const rootPkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));

const [mode, ...rest] = process.argv.slice(2);

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

function distTagFor(version) {
  const pre = semver.prerelease(version); // null | [id, num] | [num]
  if (!pre) return "latest";
  const id = pre.find((p) => typeof p === "string");
  return id || "next";
}

let current = rootPkg.version;
let next;

if (mode === "bump") {
  const [type, preid] = rest;
  const allowed = ["major", "minor", "patch", "premajor", "preminor", "prepatch", "prerelease"];
  if (!allowed.includes(type)) fail(`Unknown release type "${type}". Use one of: ${allowed.join(", ")}`);
  if (!semver.valid(current)) fail(`Root package.json version "${current}" is not valid semver.`);
  next = type.startsWith("pre")
    ? semver.inc(current, type, preid || "beta")
    : semver.inc(current, type);
} else if (mode === "tag") {
  const [version] = rest;
  const clean = String(version || "").replace(/^v/, "");
  if (!semver.valid(clean)) fail(`"${version}" is not a valid semver version.`);
  current = clean;
  next = clean;
} else {
  fail('Usage: release-version.mjs bump <type> [preid]  |  release-version.mjs tag <version>');
}

process.stdout.write(JSON.stringify({ current, next, distTag: distTagFor(next) }) + "\n");
