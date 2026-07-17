# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
All packages in the monorepo share a single version.

## [21.2.0]

### Added

- A monorepo Storybook (`npm run storybook`) documenting every component of
  `@ca-webstack/ng-components` and `@ca-webstack/ng-components-extra` with
  interactive usage examples, backed by an automated test suite (structural
  and keyboard-interaction checks) that runs in CI on every change.

### Changed

- Broadened automated accessibility verification for
  `@ca-webstack/ng-components` and `@ca-webstack/ng-components-extra` —
  colour-contrast auditing and keyboard-interaction regression testing now run
  alongside the existing static analysis — and published a formal
  accessibility conformance statement (`ACCESSIBILITY.md`) covering both
  packages against WCAG 2.2 AA / EN 301 549.
- Darkened a handful of default text/UI colour tokens in
  `@ca-webstack/ng-components` to meet the WCAG 1.4.3 contrast requirement
  confirmed by the audit above: label/placeholder/readonly text (`$sh-light-gray`
  → `$sh-text-gray`), primary text and the primary button's background
  (`$sh-azure` → `$sh-primary-text` for text/fill use — `$sh-azure` itself is
  unchanged for borders/large UI), and validation warning text (`$sh-mandarin`
  → `$sh-warning-text`). All overridable via existing CSS custom properties
  (`--label-color`, `--sh-first`, …), so a theme customising them is
  unaffected — but consumers relying on the previous shipped defaults may
  notice a visual change.

## [21.1.0]

### Added

- Initial public open-source release of the CodeArchitects Enterprise Platform
  WebStack monorepo under the Apache License 2.0.
- `@ca-webstack/*` libraries published from a single npm-workspaces
  monorepo orchestrated with Turborepo.
- Project legal and governance documentation: `LICENSE`, `NOTICE`,
  `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `GOVERNANCE.md`,
  `SUPPORT.md`, issue/PR templates, and `CODEOWNERS`.
- Continuous integration (build + test) and Dependabot configuration.

## [8.6.0] — branch version/8

### Added

- Initial public open-source release of the CodeArchitects Enterprise Platform
  WebStack monorepo under the Apache License 2.0.
- `@ca-webstack/*` libraries published from a single npm-workspaces
  monorepo orchestrated with Turborepo.
- Project legal and governance documentation: `LICENSE`, `NOTICE`,
  `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `GOVERNANCE.md`,
  `SUPPORT.md`, issue/PR templates, and `CODEOWNERS`.
- Continuous integration (build + test).

[8.6.0]: https://github.com/codearchitects/CodeArchitects.EnterprisePlatform.WebStack/releases/tag/v8.6.0
[21.1.0]: https://github.com/codearchitects/CodeArchitects.EnterprisePlatform.WebStack/releases/tag/v21.1.0
[21.2.0]: https://github.com/codearchitects/CodeArchitects.EnterprisePlatform.WebStack/releases/tag/v21.2.0
