---
phase: 10
plan: "01"
subsystem: delegate-flow
tags: [routing, delegate, credentials]
requires: [providers.Provider, /credentials, /gusto-login]
provides: [connectNowPath]
affects: [/recipient, /connect-method]
tech-stack:
  added: []
  patterns: [shared-routing-helper]
key-files:
  created: [src/lib/connectRoute.ts]
  modified: [src/app/connect-method/page.tsx, src/app/recipient/page.tsx]
decisions:
  - Factored per-type "connect now" routing into one helper so the self and delegate paths cannot drift.
metrics:
  duration: ~10m
  completed: 2026-06-09
---

# Phase 10 Plan 01: Delegate Credential Entry Summary

Routed the invited recipient ("Get Started" on `/recipient`) through the SAME per-type credential entry as the self path via a shared `connectNowPath(provider)` helper, removing the hardcoded `/connecting?provider={slug}` self-tail that skipped SFTP host/credential entry.

## What Changed

1. **NEW `src/lib/connectRoute.ts`** — `connectNowPath(provider: Provider): string`. Returns `/gusto-login` for `authMethod === 'redirect'`, else `/credentials?provider=${provider.slug}`. Imports `Provider` type from `@/lib/providers`. Verbatim per spec.
2. **`src/app/connect-method/page.tsx`** — imports `connectNowPath`; `handleSelfClick` reduced to `router.push(connectNowPath(provider))`. Behavior unchanged. Dropped the now-unused `authMethod` from the destructure (kept `name`, `slug`). Delegate OptionRow → `/invite?provider={slug}` untouched.
3. **`src/app/recipient/page.tsx`** — imports `connectNowPath`; "Get Started" onClick changed from `router.push(\`/connecting?provider=${slug}\`)` to `router.push(connectNowPath(provider))`. Dropped the now-unused `slug` destructure (kept `name`). Updated the stale doc comment: recipient now enters the same per-type credential entry as the self path (Gusto mock / Principal creds+2FA / SFTP host+creds); no `&2fa=1`.

## Resulting delegate flow per type

- **Gusto:** Get Started → `/gusto-login` → Authorize → `/connecting?provider=gusto` → `/success`
- **Principal:** Get Started → `/credentials?provider=principal` → `/verify` (2FA) → `/connecting` → `/success`
- **SFTP:** Get Started → `/credentials?provider=sftp` (Host + Username + Password) → `/connecting` → `/success`

## Deviations from Plan

None — plan executed exactly as written. (Removing the unused `authMethod` / `slug` destructure bindings is a strict-lint requirement of the edit, not a behavior deviation.)

## Acceptance Gates

- `npx tsc --noEmit` → 0 errors (TSC_OK).
- `npm run lint` → "No ESLint warnings or errors".
- `npm run lint:tokens` → PASS (no off-token hex or raw px).
- `npm run build` → compiles; all routes prerendered (`/recipient`, `/connect-method`, `/credentials`, `/gusto-login` present).
- `git diff --name-only` → only `src/app/connect-method/page.tsx`, `src/app/recipient/page.tsx` (+ untracked new `src/lib/connectRoute.ts`, + untracked `.planning`).
- Runtime smoke (throwaway port 3457, prod `next start`):
  - `/recipient?provider=sftp` → 200; recipient page chunk contains `/credentials?provider=` and `/gusto-login`, and contains **0** hardcoded `/connecting?provider=` and **0** `2fa=1`.
  - `/recipient?provider=gusto` → 200; recipient chunk references `/gusto-login`.
  - `/connect-method?provider=principal` → 200; connect-method chunk contains `/credentials?provider=`, `/gusto-login`, and `/invite?provider=` (delegate row intact).

## Self-Check: PASSED

- FOUND: src/lib/connectRoute.ts
- FOUND: modified src/app/connect-method/page.tsx
- FOUND: modified src/app/recipient/page.tsx
