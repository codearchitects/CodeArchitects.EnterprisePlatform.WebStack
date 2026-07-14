# Repository instructions for GitHub Copilot

CodeArchitects Enterprise Platform — WebStack. npm-workspaces monorepo, 19
public `@ca-webstack/*` packages, orchestrated by Turborepo. Open source under
Apache-2.0. Default branch: `master`.

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

Directory-to-package mapping: `ca-X` → `@ca-webstack/X` (the `ca-` prefix is
dropped from the npm name). Exception: `ca-ng-components-extra` publishes as
`@ca-webstack/ng-components-extra` (kept `-extra` to avoid colliding with the
existing `@ca-webstack/ng-components`).

## Commands

```bash
npm run setup            # single install for the whole workspace
npm run build            # turbo, topological order, cached
npm run build.watch      # watch mode across the graph
npm run test             # cross-env TZ=Europe/Rome, turbo run test
npm run lint
npm run clean            # nukes node_modules/dist/.turbo everywhere
npx turbo run <task> --filter=@ca-webstack/<pkg>   # target one package (+ its deps)
```

## Versioning model — important, read before suggesting package.json edits

All 19 packages share **one version**. The root `package.json` `"version"` is
the single source of truth. Every workspace package's `package.json` stays at
the placeholder `"0.0.0"` with wildcard internal dependency ranges **in source
control** — do not suggest hand-editing a workspace package's version or pinning
an internal `@ca-webstack/*` dependency to a concrete version; that is only ever
done by `scripts/set-version.mjs` at build/publish time and is never committed
for workspace packages.

- `scripts/release-version.mjs` computes the next version (reads root, never writes).
- `scripts/set-version.mjs <version>` stamps the version + pins internal deps,
  used transiently during build/publish only.
- A release commits only the root `package.json` bump + a `v<version>` git tag.

## Release process

`.github/workflows/publish.yml` — manual dispatch (bump type) or triggered by
publishing a GitHub Release tagged `v<version>`. Publishes every package to npm
via `scripts/publish.mjs` (idempotent; copies `LICENSE`+`NOTICE` into each
`dist/`), then commits the version bump and pushes a tag to `master`. That push
is authenticated with a **GitHub App installation token**, not the default
token, because it must bypass the branch protection ruleset on `master`. Do not
suggest simplifying that authentication step — it exists specifically to solve
that constraint.

## Security & SBOM

- `npm run audit:ci` (`scripts/check-vulnerabilities.mjs`) is the CI gate: fails
  on any advisory affecting **shipped** (production) dependencies that is not
  listed in `.github/allowed-advisories.txt`. Dev/build-tooling advisories are
  informational only (documented in `SECURITY.md`), never gate CI.
- `npm run report:security` regenerates local, git-tracked snapshots under
  `reports/{audit,sbom,vulnerabilities}/` — manual only, not run in CI.
- Report vulnerabilities via GitHub Security Advisories (private) per
  `SECURITY.md`, never as a public issue.

## Conventions

- Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, …) for commits and PR titles.
- **No per-file license headers.** The repo is covered by root `LICENSE` +
  `NOTICE` and each package's `"license": "Apache-2.0"`. Do not add headers to
  new files.
- Do not commit build artifacts (`dist/`, `.turbo/`, `.angular/`, `.tmp/`) — gitignored.
- Single root `package-lock.json` is authoritative; per-package lockfiles are gitignored.
- Contributions are licensed under Apache-2.0 by submission (see `CONTRIBUTING.md`).
