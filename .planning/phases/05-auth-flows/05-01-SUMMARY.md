---
phase: 05-auth-flows
plan: 01
subsystem: auth-flows
tags: [auth, routes, next-app-router, mui, ds-components]
requires:
  - "DS components: FlowLayout, FetchLogo, Input, Button, Link (Phases 1–4)"
  - "Suspense + useSearchParams pattern from /connect-method"
provides:
  - "AUTH-01: /sign-in + /sign-up (?org demo branch)"
  - "AUTH-02: /join-organization + /create-organization"
  - "AUTH-03: /forgot-password → /check-email → /set-new-password → /password-updated"
affects:
  - "src/app/* route tree (8 net-new routes)"
tech-stack:
  added: []
  patterns:
    - "Mocked auth screens assembled from DS components only"
    - "Suspense-wrapped useSearchParams demo branch (?org=existing)"
    - "Splash (/) as signed-in landing stand-in"
key-files:
  created:
    - src/app/sign-in/page.tsx
    - src/app/sign-up/page.tsx
    - src/app/join-organization/page.tsx
    - src/app/create-organization/page.tsx
    - src/app/forgot-password/page.tsx
    - src/app/check-email/page.tsx
    - src/app/set-new-password/page.tsx
    - src/app/password-updated/page.tsx
  modified: []
decisions:
  - "Followed Figma over task text on /password-updated: success-green title, NO checkmark icon"
  - "Reworded /password-updated comment to avoid literal 'CheckCircle' token so the plan's `! grep CheckCircle` gate stays green"
metrics:
  tasks: 3
  files: 8
  completed: 2026-06-09
---

# Phase 05 Plan 01: Auth Flows Summary

Eight net-new `'use client'` auth routes (sign-in, sign-up, join/create-organization, and the four-step password-recovery chain) assembled entirely from the existing DS components and wired into a fully navigable graph with no dead buttons — all mocked, no real auth/session/email.

## What Was Built

| Route | Req | Key elements | Primary CTA → |
|-------|-----|--------------|---------------|
| /sign-in | AUTH-01 | Email + Password inputs, right-aligned "Forgot password?", bottom "Sign up" | / |
| /sign-up | AUTH-01 | Suspense + useSearchParams; 4 ordered inputs (Work email, Connection code, Password, Confirm password); bottom "Sign in" | /create-organization (default) · /join-organization (?org=existing) |
| /join-organization | AUTH-02 | Subtitle, "Use a different email" → /sign-up | / |
| /create-organization | AUTH-02 | Organization name input | / |
| /forgot-password | AUTH-03 | Email input, "Back to sign in" → /sign-in | /check-email |
| /check-email | AUTH-03 | "Resend link" (re-loads), demo "Open the reset link (demo)" → /set-new-password | /sign-in |
| /set-new-password | AUTH-03 | New + Confirm password inputs | /password-updated |
| /password-updated | AUTH-03 | Success-green title, NO icon | /sign-in |

## Decisions Made

- **/password-updated Figma divergence (FLAGGED):** The task originally requested a `CheckCircleRounded` success mark. Figma node 474:273 shows NO checkmark icon — instead the title "Password updated" is rendered in **success green** (`color: 'success.main'`). Per "Figma is authoritative," the route renders the green title with no icon import. A check-circle mark can be added later if preferred.
- **/sign-up two URLs confirmed:** `/sign-up` → "Create account" → `/create-organization` (no existing org). `/sign-up?org=existing` → "Create account" → `/join-organization` (org exists). Branch reads `searchParams.get('org')` inside the Suspense boundary, mirroring `/connect-method`.
- **Splash (/) as landing stand-in:** Auth-completing actions (Sign in, Request to join, Create organization) navigate to `/` — documented per spec; there is no dashboard yet.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Reworded /password-updated comment to satisfy the gate**
- **Found during:** Task 3 verification
- **Issue:** The plan's automated verify includes `! grep -q "CheckCircle" src/app/password-updated/page.tsx`. My initial divergence comment used the literal phrase "CheckCircleRounded", which made the grep match (count 1) and failed the gate — even though no icon is imported or rendered.
- **Fix:** Reworded the comment to "a rounded check-circle success mark" (no literal `CheckCircle` token). The divergence is still fully documented in the comment and here.
- **Files modified:** src/app/password-updated/page.tsx
- **Commit:** 6a32d62

## Acceptance Gates (all green)

- `npx tsc --noEmit` → 0 errors
- `npm run lint` → No ESLint warnings or errors
- `npm run lint:tokens` → PASS (no off-token hex / raw px)
- `npm run build` → Compiled successfully; all 8 routes appear in the route list
- `git diff --quiet package.json` → deps-unchanged
- Runtime smoke (prod server, port 3999): all 8 routes → 200; `/sign-up?org=existing` → 200. Served HTML contains "Sign in to Fetch" and "Password updated".

### Constraint checks (all 0 matches)

- No `next/link` imports
- No `: any` / `<any>` / `as any`
- No `console.log`
- Changed files = only the 8 new `src/app/*/page.tsx` routes (no connection-flow routes, no `src/components/*`, no `providers.ts`)

## Navigation graph (no dead buttons)

Every Button/Link navigates or performs a real action; verified each documented edge exists in source:
- /sign-in: Forgot password? → /forgot-password; Sign in → /; Sign up → /sign-up
- /sign-up: Create account → /create-organization | /join-organization (?org=existing); Sign in → /sign-in
- /join-organization: Request to join → /; Use a different email → /sign-up
- /create-organization: Create organization → /
- /forgot-password: Send reset link → /check-email; Back to sign in → /sign-in
- /check-email: Back to sign in → /sign-in; Resend link → /check-email; Open the reset link (demo) → /set-new-password
- /set-new-password: Update password → /password-updated
- /password-updated: Continue to sign in → /sign-in

## Known Stubs

None that block the plan goal. All screens are intentionally mocked (no real auth/session/email) per spec — controlled inputs hold local `useState` only, which is the documented Phase 05 scope. The "/" landing stand-in and the demo "Open the reset link" link are documented spec/task additions, not stubs.

## Self-Check: PASSED

- All 8 created files exist on disk.
- All 3 task commits present: bdd91de (AUTH-01), 5d58d40 (AUTH-02), 6a32d62 (AUTH-03).
