# Phase 01 Deferred Items

## Audit findings (out of scope for Phase 1)

### postcss XSS in CSS stringify output (moderate, transitive via Next.js)

- **Discovered:** Plan 01-01, Task 1 (npm install of Next 15.x)
- **Source:** GHSA-qx2v-qp2m-jg93 — postcss <8.5.10 used internally by Next.js
- **Why deferred:** Transitive dependency inside Next.js's own CSS pipeline. Not in our user-facing surface (we don't stringify untrusted CSS). Next.js needs to upgrade its own postcss pin. Re-evaluate at every `npm install` / Next minor bump.
- **Action:** Track upstream Next.js release notes; re-run `npm audit` at Phase 4 hardening.

## Tooling adaptations

### Package manager: npm (not pnpm)

- **Why:** `pnpm` is not installed on the executor's PATH. Plan 01-01 explicitly permits npm fallback per the executor's context note ("if pnpm isn't available on PATH or you encounter friction, npm is acceptable").
- **Impact:** Lockfile is `package-lock.json`, not `pnpm-lock.yaml`. `package.json.files_modified` references `pnpm-lock.yaml` in the plan header — replaced with `package-lock.json` for this execution. Downstream plans should use `npm` consistently.
- **Re-evaluate:** Switch to pnpm if/when it lands on the dev environment; both tools resolve the same dependency graph.
