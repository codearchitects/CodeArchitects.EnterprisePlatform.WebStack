# Security Reports

Timestamped audit and SBOM reports generated locally via `npm run report:security`.

These files are **git-tracked** (not ignored) so the history of vulnerabilities, SBOM changes, and accepted advisories is visible in the repository.

## Files

- **`audit/audit-shipped.json`** — `npm audit --omit=dev` output (production dependencies only — what consumers install). Fails CI if unaccepted vulnerabilities are found.
- **`audit/audit-full.json`** — `npm audit` output (includes dev/build tooling). Informational; does not gate.
- **`sbom/sbom.json`** — CycloneDX Software Bill of Materials (production dependencies). Uploaded to every GitHub release.
- **`vulnerabilities/advisories.md`** — Human-readable summary of found advisories vs. accepted advisories (from `.github/allowed-advisories.txt`).

## Generate

```bash
npm run report:security
```

This overwrites the previous report (git tracks the history via commits).

## Review before commit

```bash
git diff reports/
```

Then stage & commit:

```bash
git add reports/
git commit -m "docs: update security reports"
```
