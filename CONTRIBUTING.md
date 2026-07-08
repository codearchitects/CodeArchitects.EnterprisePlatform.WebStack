# Contributing to CodeArchitects Enterprise Platform — WebStack

Thank you for your interest in contributing! This document explains how to
propose changes and what we expect from contributions.

By participating in this project you agree to abide by our
[Code of Conduct](CODE_OF_CONDUCT.md).

## Ways to contribute

- **Report a bug** — open an issue using the *Bug report* template.
- **Request a feature** — open an issue using the *Feature request* template.
- **Improve documentation** — small doc fixes are always welcome via pull request.
- **Submit code** — see the workflow below.

For **security vulnerabilities**, do **not** open a public issue. Follow the
process in [SECURITY.md](SECURITY.md).

## Development setup

This is an [npm workspaces](https://docs.npmjs.com/cli/using-npm/workspaces)
monorepo orchestrated with [Turborepo](https://turbo.build/).

**Requirements:** Node.js >= 22, npm >= 10.

```bash
git clone <your-fork-url>
cd CodeArchitects.EnterprisePlatform.WebStack
npm run setup      # single install for the whole workspace
npm run build      # build every package in dependency order
npm run test       # run the test suites
npm run lint       # lint all packages
```

Target a single package with `--filter`, e.g.
`npx turbo run test --filter=@ca-webstack/reflection`.

## Pull request workflow

1. **Fork** the repository and create a topic branch from `master`
   (e.g. `feat/short-description` or `fix/short-description`).
2. Make your change. Keep the diff focused — one logical change per PR.
3. Add or update **tests** for any behavioural change.
4. Ensure the full suite is green locally:
   ```bash
   npm run build && npm run lint && npm run test
   ```
5. Write a clear PR description: what changed, why, and how it was verified.
   Fill in the pull request template.
6. Link any related issue (e.g. `Closes #123`).

We use [Conventional Commits](https://www.conventionalcommits.org/) for commit
and PR titles (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:` …). This
keeps history readable and helps with release notes.

## Coding guidelines

- Match the style of the surrounding code; the repo's ESLint config is the
  source of truth (`npm run lint`).
- Do not commit build artifacts (`dist/`, `.tmp/`, `coverage/`, `.turbo/`,
  `.angular/`) — these are git-ignored.
- Keep public API changes deliberate; all packages share a single version and
  pin internal dependencies to it.

## Licensing of contributions

This project is licensed under the [Apache License 2.0](LICENSE). By submitting
a contribution, you agree that your contribution is licensed under the same
terms, and you certify that you have the right to submit it under that license
(per the Apache License 2.0, Section 5, "Submission of Contributions"). You
retain the copyright to your contribution.

Please do **not** add per-file license headers; the repository is covered by the
root `LICENSE` and `NOTICE`, and each package declares `"license": "Apache-2.0"`.

## Questions

For general questions and support, see [SUPPORT.md](SUPPORT.md).
