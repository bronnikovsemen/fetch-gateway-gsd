---
phase: 06-demo-home
plan: 01
subsystem: demo-flow
tags: [launcher, gusto-mock, connect-method, sftp]
requires: []
provides:
  - "Demo home launcher at /"
  - "Bespoke 2-step Gusto OAuth mock at /gusto-login"
  - "Gusto redirect → /gusto-login + Figma 8:365 SFTP modal on /connect-method"
affects:
  - src/app/page.tsx
  - src/app/gusto-login/page.tsx
  - src/app/connect-method/page.tsx
  - package.json
tech-stack:
  added: []
  patterns:
    - "Bespoke-brand exception scoped to a single file with a narrowed lint:tokens exclusion"
key-files:
  created:
    - src/app/gusto-login/page.tsx
  modified:
    - src/app/page.tsx
    - src/app/connect-method/page.tsx
    - package.json
decisions:
  - "Gusto brand hex lives inline only in src/app/gusto-login; lint:tokens hex gate narrowed to exactly that path (px gate untouched)."
  - "Bare numeric sx values used throughout the Gusto mock so the unmodified px gate stays green."
  - "SFTP 'Sign In' vs Principal 'Connect' button label is presentation-only; handleConnect routing unchanged."
metrics:
  duration: "~12m"
  completed: 2026-06-09
---

# Phase 06 Plan 01: Demo Home Summary

Repurposed `/` into a Fetch-branded demo launcher, added a bespoke 2-step Gusto OAuth mock at `/gusto-login`, and made the three connection types tangible on `/connect-method` (Gusto redirect → mock; SFTP modal refined to Figma 8:365; Principal creds→2FA confirmed unchanged).

## What Was Built

**DEMO-01 — `/` launcher** (`ef8b114`): Removed the splash `useEffect` auto-redirect, both `scaleIn`/`breathe` keyframes, and the `@emotion/react` import. `/` now renders `FlowLayout maxWidth={440} px={4} py={4}` → centered header (`FetchLogo` cluster, h5 "Fetch demo", body2 intro) → three DS `OptionRow`s navigating to `/sign-up?org=existing`, `/sign-up`, `/welcome`.

**DEMO-02 — `/gusto-login` bespoke mock** (`1b94009`): New `'use client'` page with `step: 'signin' | 'authorize'` local state. Gusto palette declared as a module-scope `GUSTO` const and used inline (coral wordmark, teal action/hover, ink, muted, border, deny red, white bg). Step 1: "gusto" wordmark, "Sign In", controlled Email + Password fields with teal "Forgot …" links, teal full-width "Continue" → authorize, "or" divider, white "Sign in with Google" → authorize, teal "Get started · Help center" footer. Step 2: wordmark, "Authorize Fetch to connect to your account?" heading + body, teal "Authorize" → `/connecting?provider=gusto`, centered red "Deny" → `/connect-method?provider=gusto`. `package.json` `lint:tokens` first grep's `grep -vE` extended with `|src/app/gusto-login`; px grep untouched and the file uses zero `'Npx'` literals (bare numeric sx values only).

**DEMO-03 — `/connect-method` rewire + SFTP modal** (`1821a96`): `handleSelfClick` redirect branch now `router.push('/gusto-login')`. SFTP modal aligned to Figma 8:365 in DS styling (no purple `#8635f6`): title "Sign in to SFTP", subtitle "Enter your SFTP administrator credentials", Host ("Enter the host") / Username or Email ("Enter the username/email") / Password ("Enter the password") inputs, "Sign In" primary button, and a centered `caption` "Your credentials are encrypted and never stored by Fetch". `handleConnect` unchanged — SFTP → `/connecting?provider=sftp` (no 2FA); Principal → `&2fa=1` → `/verify` → `/success` intact.

## Acceptance Gates

| Gate | Result |
|------|--------|
| `npx tsc --noEmit` | 0 errors |
| `npm run lint` | clean (no ESLint warnings/errors) |
| `npm run lint:tokens` | PASS (Gusto hex present + excluded; px gate green) |
| `npm run build` | compiles; `/` and `/gusto-login` in route list |
| Deps unchanged | 8 deps / 7 devDeps before & after; lockfile untouched; only `lint:tokens` script line changed |
| Runtime `/` | HTTP 200 — ships "Fetch demo" + 3 OptionRow titles |
| Runtime `/gusto-login` | HTTP 200 — ships "Sign In" + "gusto"; "Authorize Fetch to connect…" present in JS chunk (step 2) |
| Runtime `/connect-method?provider=gusto` | HTTP 200 |

## Deviations from Plan

None — plan executed exactly as written.

The "Sign in with Google" hover background `#F7F8FA` is the one hex beyond the documented `GUSTO` palette; it lives inside `src/app/gusto-login` (the excluded file), so it is within the bespoke-branding allowance and does not affect lint:tokens.

## Threat Surface

No new security-relevant surface beyond the plan's `<threat_model>`. The Gusto mock inputs (T-06-01) remain demo-only local state — never validated, submitted, stored, or sent (documented in the file). The bespoke-hex bypass (T-06-02) is mitigated by narrowing the exclusion to exactly `src/app/gusto-login` rather than a blanket disable. No package installs (T-06-SC) — deps verified unchanged.

## Self-Check: PASSED

- src/app/page.tsx — FOUND
- src/app/gusto-login/page.tsx — FOUND
- src/app/connect-method/page.tsx — FOUND
- package.json — FOUND
- Commit ef8b114 (DEMO-01) — FOUND
- Commit 1b94009 (DEMO-02) — FOUND
- Commit 1821a96 (DEMO-03) — FOUND
