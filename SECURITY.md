# Security Policy

We take the security of the CodeArchitects Enterprise Platform — WebStack
seriously. Thank you for helping keep it and its users safe.

## Supported versions

Security fixes are provided for the latest released major version line. All
packages in this monorepo share a single version.

| Version | Supported          |
| ------- | ------------------ |
| 21.x    | :white_check_mark: |
| < 21    | :x:                |

## Reporting a vulnerability

**Please do not report security vulnerabilities through public GitHub issues,
pull requests, or discussions.**

Instead, report them privately through
**[GitHub Security Advisories](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability)**:

1. Go to the **Security** tab of this repository.
2. Click **Report a vulnerability**.
3. Fill in the advisory form with as much detail as possible.

Please include, where possible:

- The affected package(s) and version(s).
- A description of the vulnerability and its impact.
- Steps to reproduce, a proof of concept, or affected source location.
- Any known mitigations or workarounds.

## What to expect

- **Acknowledgement** of your report within **3 business days**.
- An initial **assessment** within **10 business days**.
- We will keep you informed of remediation progress and coordinate a disclosure
  timeline with you.
- We support **coordinated disclosure**: please give us a reasonable opportunity
  to release a fix before any public disclosure.

We appreciate responsible disclosure and will credit reporters in the release
notes unless you prefer to remain anonymous.

## Dependency auditing & SBOM

Every push and pull request runs a **Security & SBOM** job
([`.github/workflows/ci.yml`](.github/workflows/ci.yml)):

- **Full scan (informational):** `npm audit` over the whole dependency graph,
  including the build/dev toolchain (Angular CLI dev-server, webpack, karma,
  esbuild, …). These do not ship to consumers and never fail the build.
- **Gate on shipped dependencies:** `npm run audit:ci`
  ([`scripts/check-vulnerabilities.mjs`](scripts/check-vulnerabilities.mjs))
  audits only the **production** dependency graph — what consumers install — and
  fails the build on any advisory that is not on the allow-list.
- **SBOM:** a CycloneDX SBOM of the shipped dependencies (`npm run sbom`) is
  generated and uploaded as a build artifact.

Run the same checks locally:

```bash
npm run audit        # production advisories (what ships)
npm run audit:all    # full graph, incl. dev/build tooling
npm run audit:ci     # the CI gate
npm run sbom         # write sbom.json (CycloneDX)
```

### Accepted advisories (allow-list)

The single source of truth is
[`.github/allowed-advisories.txt`](.github/allowed-advisories.txt) — one `GHSA`
id per line. Only add an advisory when **no fix is available** and the risk has
been assessed as acceptable, and document the rationale below.

| Advisory | Package | Rationale | Review by |
| -------- | ------- | --------- | --------- |
| _(none)_ | — | Shipped dependencies currently report zero vulnerabilities. | — |
