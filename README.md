# CodeArchitects Enterprise Platform — WebStack

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Node.js >= 22](https://img.shields.io/badge/node-%3E%3D22-brightgreen.svg)](https://nodejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

An npm-workspaces monorepo of the `@ca-webstack/*` libraries,
orchestrated with [Turborepo](https://turbo.build/). One install links every
internal library; one command builds them all in the correct order.

## Requirements

- Node.js >= 22
- npm >= 10

## Getting started

```bash
git clone <repo>
cd CodeArchitects.EnterprisePlatform.WebStack
npm run setup      # single install for the whole workspace (links internal libs)
npm run build      # builds every package in dependency order
```

That's it — no per-package installs, no manual build ordering.

## How it works

- **npm workspaces** — a single root `node_modules`. Every internal library is
  symlinked into `node_modules/@ca-webstack/*`, so a
  package always consumes the sibling it depends on, not a registry copy.
- **Turborepo** — derives the dependency graph from each package's
  `dependencies`/`devDependencies` and runs builds in topological order
  (`build` `dependsOn` `^build`). Results are cached: unchanged packages are not
  rebuilt.
- **dist consumption** — each package's `package.json` exposes its built `dist/`
  output (`main`/`module`/`types`/`exports`). ng-packagr and webpack both emit a
  self-contained manifest into `dist/`, which is also what gets published.

### Change propagation

Edit library **A**; the next build of any consumer **B** rebuilds A first, then B:

```bash
npm run build                          # rebuilds only what changed + its dependents
npm run build.watch                    # watch mode across the whole graph
npx turbo run build --filter=@ca-webstack/ng-shell   # build one package + its deps
```

## Common commands

| Command | What it does |
| --- | --- |
| `npm run setup` | Install the whole workspace (single lockfile). |
| `npm run build` | Build every package in topological order (cached). |
| `npm run build.watch` | Rebuild affected packages on change. |
| `npm run test` | Run every package's tests (after building deps). |
| `npm run lint` | Lint every package. |
| `npm run clean` | Remove all `node_modules`, build artifacts and turbo cache. |
| `npm run version:set X.Y.Z` | Set one shared version across all packages and pin internal deps to it. |

Target a single package with `--filter`, e.g.
`npx turbo run test --filter=@ca-webstack/reflection`.

## Versioning & publishing

All packages share **one version**. The source tree keeps each workspace
package at the `0.0.0` placeholder (with wildcard internal deps); the **root
`package.json` version is the single source of truth** for the current released
version. At release time `scripts/set-version.mjs` stamps the real version into
every package and pins internal deps to it — the working tree is only mutated
during the build, never committed for the workspace packages.

Publishing is handled by
[`.github/workflows/publish.yml`](.github/workflows/publish.yml). It requires the
`NPM_TOKEN` repository secret (an npm automation token with publish rights).

### Option 1 — run the workflow from the Actions tab (recommended)

Pick a **bump type**; the workflow computes the next version from the current
one, publishes, and — for a stable release — commits the version bump to the
branch and creates a `v<version>` tag:

| Bump | Result | npm dist-tag |
| --- | --- | --- |
| `patch` / `minor` / `major` | stable, e.g. `21.0.1` / `21.1.0` / `22.0.0` | `latest` |
| `preminor` / `premajor` / `prepatch` + pre-id | e.g. `21.1.0-beta.0` | `beta` (or `rc`/`alpha`/`canary`/`next`) |
| `prerelease` + pre-id | increments an existing pre-release, e.g. `21.1.0-beta.0` → `21.1.0-beta.1` | the pre-id |

Pre-releases are published under their own dist-tag and do **not** move
`latest`, so consumers stay on stable unless they opt in with
`npm install @ca-webstack/<pkg>@beta`. Tick **Dry run** to build and
`npm publish --dry-run` without publishing or touching git.

### Option 2 — publish from a GitHub Release

Create a Release with a tag like `v21.1.0` (or `v21.1.0-rc.1`). The workflow
publishes exactly that version; the dist-tag is derived from the tag (stable →
`latest`, pre-release → its identifier).

### Publish locally (once authenticated with npm)

```bash
npm run version:set 21.1.0    # stamp the version everywhere (incl. root)
npm run build
node scripts/publish.mjs --access public --tag latest   # add --dry-run to preview
```

## Packages

Libraries live in the `ca-*` and `caep-*` directories. Pure-TypeScript libraries
build with webpack; Angular libraries build with ng-packagr. Both are driven
uniformly through Turborepo.

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for the
development setup and pull-request workflow, and note our
[Code of Conduct](CODE_OF_CONDUCT.md). Project governance is described in
[GOVERNANCE.md](GOVERNANCE.md).

## Security

Please report vulnerabilities privately — see [SECURITY.md](SECURITY.md). Do not
open public issues for security problems.

## Support

For questions and usage help, see [SUPPORT.md](SUPPORT.md).

## License

Copyright 2026 Code Architects S.r.l.

Licensed under the [Apache License, Version 2.0](LICENSE). See the [NOTICE](NOTICE)
file for attribution notices. Unless required by applicable law or agreed to in
writing, software distributed under the License is distributed on an "AS IS"
BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
