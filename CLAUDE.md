# CodeArchitects Enterprise Platform — WebStack

npm-workspaces monorepo, 19 public `@ca-webstack/*` packages, orchestrated by
Turborepo. Open source under Apache-2.0. Default branch: `master`.

## Structure

```
ca-*/                  workspace packages (glob in root package.json "workspaces")
  ca-reflection, ca-data-structures, ca-data-context, ca-change-tracker,
  ca-event-manager, ca-policy-engine,                    (pure TS, webpack)
  ca-ng-*               (Angular libs, ng-packagr): aspects, command-dispatcher,
                        components, components-extra, data-context, event-manager,
                        graphql, i18n, policy-engine, react, serializer, shell, signalr
scripts/                release + report tooling, all dependency-free Node ESM (.mjs)
.github/workflows/      ci.yml (build+test+security), publish.yml (npm release)
reports/                git-tracked security/SBOM snapshots (see reports/README.md)
```

Dir → npm name: `ca-X` → `@ca-webstack/X` (no `ca-` prefix in the package name).
Exception: `ca-ng-components-extra` → `@ca-webstack/ng-components-extra` (kept
`-extra` to avoid colliding with `@ca-webstack/ng-components`).

## Commands

```bash
npm run setup            # single install for the whole workspace
npm run build            # turbo, topological order, cached
npm run build.watch      # watch mode across the graph
npm run test             # cross-env TZ=Europe/Rome, turbo run test
npm run lint
npm run clean            # nukes node_modules/dist/.turbo everywhere, then re-run setup
npx turbo run <task> --filter=@ca-webstack/<pkg>   # target one package (+ its deps)
```

## Versioning model (read before touching any package.json)

**Single shared version across all 19 packages.** Source of truth = root
`package.json` `"version"`. Every workspace package.json stays at the
placeholder `"0.0.0"` with wildcard internal deps **in source** — never hand-edit
a workspace package's version or pin an internal dep version yourself.

- `scripts/release-version.mjs` — computes the next version from root (never writes).
- `scripts/set-version.mjs <version>` — stamps the real version into every
  workspace package + root, pins internal deps to it. Used at build/publish time
  only; the stamped workspace changes are **never committed**.
- After a stable release, only the root `package.json` bump + a `v<version>` tag
  are committed to `master` (workspace package.json changes are discarded via
  `git checkout -- '*/package.json'`).

## Release (`.github/workflows/publish.yml`)

Manual dispatch (Actions tab, pick patch/minor/major or a pre* + preid) or via
publishing a GitHub Release tagged `v<version>`. Publishes to npm
(`scripts/publish.mjs`, idempotent, copies LICENSE+NOTICE into each dist),
commits the root version bump, tags, pushes — **using a GitHub App installation
token**, not `GITHUB_TOKEN`, because the push must bypass the branch ruleset on
`master`. Never touch that token wiring without understanding why it's there:
see the (private, separate) `oss-playbook` repo, doc 03, for the full rationale.

## Security reports

`npm run report:security` regenerates `reports/{audit,sbom,vulnerabilities}/*`
locally (overwrites, git tracks history). Not run in CI. CI's own gate is
`npm run audit:ci` (`scripts/check-vulnerabilities.mjs`), which fails on any
shipped-dependency advisory not listed in `.github/allowed-advisories.txt`
(dev/build-tooling advisories are informational only, documented in `SECURITY.md`).

## Conventions

- Conventional Commits (`feat:`, `fix:`, `chore:`, …) for commit/PR titles.
- **No per-file license headers** — covered by root `LICENSE` + `NOTICE` +
  each package's `"license": "Apache-2.0"`. Do not add headers.
- Don't commit build artifacts (`dist/`, `.turbo/`, `.angular/`, `.tmp/`) — gitignored.
- Only one lockfile (root `package-lock.json`); per-package lockfiles are gitignored.
- Security vulnerabilities go through GitHub Security Advisories (private), never
  a public issue — see `SECURITY.md`.

## Never do this without asking first

- Commit or push (the user reviews every commit/push before it happens).
- Edit a workspace package's `version` or internal dep pins by hand.
- Change `publish.yml`'s token/checkout wiring casually — it exists to satisfy
  the branch ruleset bypass, and breaking it silently reintroduces the
  "commit-back rejected" failure mode this repo already solved once.
