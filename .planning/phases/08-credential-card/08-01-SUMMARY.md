---
phase: 08
plan: 01
subsystem: v2-flow
tags: [credentials, connect-method, flow-card, CRED-01]
requires: [FlowLayout, FetchLogo, Input, Button, Link, providers]
provides: ["/credentials route", connect-method-rewire]
affects: ["src/app/credentials/page.tsx", "src/app/connect-method/page.tsx"]
tech-stack:
  added: []
  patterns: [Suspense+useSearchParams-guard, authMethod-branch, DS-components-only]
key-files:
  created: ["src/app/credentials/page.tsx"]
  modified: ["src/app/connect-method/page.tsx"]
decisions:
  - "Dedicated /credentials card route mirroring /verify 1:1 instead of restyling the Dialog, making the ordering (credentials before /connecting) explicit."
metrics:
  duration: ~10m
  completed: 2026-06-09
---

# Phase 08 Plan 01: Credential Card Summary

Replaced the plain MUI Dialog credential modal on /connect-method with a dedicated `/credentials?provider=` flow card visually identical to /verify, so `/connecting` ("Establishing connection…") is only ever reached after credentials are submitted.

## What Was Built

### NEW `src/app/credentials/page.tsx` ('use client')
- Suspense-wrapped `CredentialsContent` + default `Page` (`<Suspense fallback={null}>`).
- `useSearchParams` `?provider=` guard: resolves slug against `providers`; if missing/unknown **OR** `authMethod === 'redirect'` → `router.replace('/select-provider')`.
- Chrome identical to /verify: `FlowLayout maxWidth={400} px={4} py={4}`, `Stack spacing={2.5}` (alignItems center, textAlign center), `<FetchLogo size={40} />`, h5 title, body2 subtitle.
- Branch by `authMethod`:
  - **credentials (Principal):** title `Sign in to ${name}` → "Sign in to Principal"; subtitle `Enter your ${name} credentials to connect. Read-only access.`; controlled DS `Input`s "Email or username" + "Password" (type="password").
  - **sftp (SFTP):** title "Connect via SFTP"; subtitle "Enter your SFTP administrator credentials"; controlled DS `Input`s "Host" + "Username or Email" + "Password" (with placeholders); footer caption "Your credentials are encrypted and never stored by Fetch" (text.secondary, centered).
- Primary DS `Button` (`sx={{ width: '100%' }}`) "Continue" → `router.push('/connecting?provider=' + slug + (credentials ? '&2fa=1' : ''))`.
- Centered DS `Link` "Back" → `router.push('/connect-method?provider=' + slug)`.

### EDIT `src/app/connect-method/page.tsx`
- Deleted the entire `<Dialog>` modal, its state (`open`, `host`, `username`, `password`), `handleConnect`, and `isSftp`.
- Returns just `<FlowLayout>` (dropped the fragment).
- Removed now-unused imports: `Dialog`, `Input`, `Button`, `Link`, `tokens`, `useState`.
- `handleSelfClick`: `redirect` → `/gusto-login` (unchanged); else → `/credentials?provider=' + slug`.
- Delegate OptionRow unchanged (→ `/invite?provider=`).

## Resulting Flow Order
- **Principal:** /connect-method → /credentials (Email+Password) → /connecting → /verify (2FA) → /success.
- **SFTP:** /connect-method → /credentials (Host+Username+Password) → /connecting → /success.
- **Gusto:** /connect-method → /gusto-login → /connecting?provider=gusto → /success (unchanged).
- /connecting is never reached before credentials for the self credentials/sftp paths.

## Deviations from Plan
None - plan executed exactly as written. The spec's `Input` label for SFTP username ("Username or Email") was preserved from the original modal; Principal uses "Email or username" per the Phase 08 scope wording.

## Acceptance Gates
1. `npx tsc --noEmit` → **0 errors**.
2. `npm run lint` → **clean** ("No ESLint warnings or errors"; no unused imports in connect-method).
3. `npm run lint:tokens` → **PASS** (no off-token hex or raw px).
4. `npm run build` → **compiles**; `/credentials` present in route list (4.17 kB).
5. Runtime smoke (prod server, throwaway port 3999):
   - `/credentials?provider=principal` → **200**; chunk ships "Sign in to ${name}" template + "Email or username".
   - `/credentials?provider=sftp` → **200**; chunk ships "Connect via SFTP" + "Host" + "encrypted and never stored by Fetch".
   - `/connect-method?provider=principal` → **200**; chunk contains "/credentials" (rewire), and **zero** "/connecting" occurrences in the minified chunk (the only source `/connecting` references are comments, stripped from the bundle).

## Self-Check: PASSED
- FOUND: src/app/credentials/page.tsx
- FOUND: src/app/connect-method/page.tsx (modified)
- FOUND: commit 3fba51e
