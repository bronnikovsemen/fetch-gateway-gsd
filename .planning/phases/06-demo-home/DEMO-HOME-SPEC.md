# Phase 06 — Demo Home — Spec

A demo launcher at `/` to pick & run 3 flows, plus making the 3 connection types tangible (Gusto redirect → bespoke mock; Principal creds → 2FA; SFTP host+creds form). Branch `demo-home` already has BOTH the auth routes and the connection routes. Sources pulled from Figma 2026-06-09 (SFTP from `q2KVTdgfZaHTwViNlMdpb1` 8:365; Gusto recreated from user-supplied images). Fetch UI = DS components/theme/tokens only; the Gusto mock is the single bespoke exception.

## Decisions
- **`/` becomes the demo home** (repurposes the splash). The splash's auto-redirect-to-`/welcome` and breathing animation are removed; `/` now renders the launcher. `/` is the hub: `/success` "Continue", join/create-org "Create…", etc. already return to `/`.
- **Principal is already realistic** (creds modal → `/connecting?&2fa=1` → `/verify` → `/success`) — leave its flow; only confirm it reads as creds → 2FA → success.
- **Gusto mock is a 2-step bespoke page** at `/gusto-login`: Gusto sign-in → OAuth authorize consent (both user images) → return to the Fetch flow.

---

## 1. Demo home — `src/app/page.tsx` (rewrite) — DEMO-01
- Remove the `useEffect` redirect + keyframes; render the launcher.
- `FlowLayout maxWidth={440} px={4} py={4}`, `Stack spacing={3}` centered header + a `Stack spacing={2}` of OptionRows.
- Header: `<FetchLogo />` (cluster), `Typography variant="h5"` "Fetch demo", `variant="body2"` (text.secondary) "Pick a flow to run through the demo."
- Three DS `OptionRow`s:
  1. title "Sign up — join an existing organization", desc "Your work domain already has a Fetch org" → `/sign-up?org=existing`
  2. title "Sign up — create a new organization", desc "Set up a brand-new Fetch organization" → `/sign-up`
  3. title "Connection flow", desc "Connect a payroll provider — Gusto, Principal, or SFTP" → `/welcome`

## 2. Gusto mock — NEW `src/app/gusto-login/page.tsx` ('use client') — DEMO-02  (BESPOKE Gusto branding, NOT Fetch DS)
Recreated from the user's two images (login.gusto-demo.com sign-in + app.gusto-demo.com/oauth/authorize). Two steps via local state (`step: 'signin' | 'authorize'`). MUI `Box`/`Stack`/`Typography` for layout; **Gusto hex colors inline, scoped to this file**. Header = Gusto wordmark (NOT FetchLogo). Reads `?provider=` is unnecessary (Gusto-specific); reads nothing — it's the Gusto mock.

Gusto palette (bespoke, this file only): coral wordmark `#F45D48`; teal action `#1C7C6E` (hover `#16685C`); ink `#1E0E35`; muted `#6B7281`; border `#D8DEE4`; deny red `#C0392B`; page bg `#FFFFFF`. Roboto/Inter are unavailable → use the app's Inter; that's fine for a mock.

**Step 1 — Sign in** (centered card, ~420px, white, 1px `#D8DEE4` border, rounded, subtle shadow):
- coral lowercase "gusto" wordmark (Typography, bold, ~28px).
- "Sign In" heading (ink, bold).
- "Email" label (bold) with a right-aligned teal "Forgot email?" text link; an email `input` (bespoke styled, controlled).
- "Password" label with right-aligned teal "Forgot password?"; a password `input`.
- teal full-width "Continue" button → set `step='authorize'`.
- "or" divider; a white "Sign in with Google" button (border, "G" — a simple colored text/emoji is fine) → also `step='authorize'` (demo).
- footer row "Get started · Help center" (teal). Page footer "Gusto © 2026 · Help Center · Terms · Privacy" (muted) is optional.
- (The left-side illustration in the image is omitted — a centered card is an acceptable mock; note it.)

**Step 2 — Authorize consent**:
- "gusto" wordmark; heading "Authorize Fetch to connect to your account?"; body "Authorizing Fetch to connect to your Gusto account will allow Fetch to view and access your payroll account information."
- teal full-width "Authorize" button → `router.push('/connecting?provider=gusto')` (returns to the Fetch flow → `/success`).
- centered red "Deny" link → `router.push('/connect-method?provider=gusto')` (back to the Fetch decision — no dead button).

**lint:tokens exception:** add `src/app/gusto-login` to the `lint:tokens` exclusion (it holds external-brand hex). Update the `lint:tokens` npm script's `grep -vE` to also exclude `src/app/gusto-login/`.

## 3. Connection types realism — DEMO-03

### 3a. Gusto (redirect) — `src/app/connect-method/page.tsx`
- Change `handleSelfClick` for `authMethod === 'redirect'`: instead of `/connecting?provider=${slug}`, navigate to **`/gusto-login`** (the mock). The mock's "Authorize" returns to `/connecting?provider=gusto` → `/success`. (Redirect providers are Gusto only.)

### 3b. SFTP (sftp) — the modal in `src/app/connect-method/page.tsx`
Align the SFTP modal to Figma 8:365 (DS-styled, not the purple mock):
- Title (h5) "Sign in to SFTP"; subtitle (body2) "Enter your SFTP administrator credentials".
- Three DS `Input`s: "Host" (placeholder "Enter the host"), "Username or Email" (placeholder "Enter the username/email"), "Password" type="password" (placeholder "Enter the password"). (Current modal already has host/username/password — refine labels/placeholders.)
- Primary "Sign In" → `/connecting?provider=sftp` (no 2FA).
- Add a footer `Typography variant="caption"` (text.secondary, centered): "Your credentials are encrypted and never stored by Fetch".
- Keep the navy/accent DS styling; do NOT use the Figma mock's purple `#8635f6`.

### 3c. Principal (credentials → 2FA) — no code change
Confirm `authMethod === 'credentials'` still: modal (username + password) → `/connecting?provider=principal&2fa=1` → `/verify` → `/success`. Reads as creds → 2FA → success. (The modal title for credentials stays "Sign in to {Provider}".)

> Note: the modal is type-aware (credentials vs sftp). With Gusto now redirecting to `/gusto-login`, the modal only opens for Principal (credentials) and SFTP (sftp).

---

## Navigation (acceptance)
```
/  (demo home)
 ├─ "join existing org"  → /sign-up?org=existing → Create account → /join-organization → Request to join → /
 ├─ "create new org"     → /sign-up             → Create account → /create-organization → Create → /
 └─ "Connection flow"    → /welcome → /permissions → /select-provider (pick provider) → /connect-method
        ├─ Gusto (redirect)    → "I'll connect it now" → /gusto-login (sign in → authorize) → /connecting?provider=gusto → /success
        ├─ Principal (creds)   → "I'll connect it now" → creds modal → /connecting?provider=principal&2fa=1 → /verify → /success
        └─ SFTP (sftp)         → "I'll connect it now" → host+creds modal (8:365) → /connecting?provider=sftp → /success
   ( delegate path "Someone on my team manages it" → /invite … unchanged )
```
No dead buttons. `/success` "Continue" → `/` (back to the demo home).

## Constraints
MUI v9 + Emotion only; strict TS (no `any`); no console.log; port 3001; theme/tokens only for Fetch UI — zero off-token hex/raw px (lint:tokens green) EXCEPT `src/app/gusto-login` (excluded); no new deps. Don't break the existing auth/connection routes.

## Requirements (REQUIREMENTS.md)
- **DEMO-01** — demo home launcher at `/` (3 OptionRow flows).
- **DEMO-02** — bespoke Gusto mock `/gusto-login` (sign-in → authorize → back to Fetch); lint:tokens excludes it.
- **DEMO-03** — connection-type realism: Gusto redirect → `/gusto-login`; SFTP modal fields per Figma 8:365; Principal creds → 2FA confirmed.

## Out of scope
Real auth/OAuth; a dashboard (signed-in landing = `/` demo home); recreating the Gusto left-side illustration; the connection-flow screens themselves (already built).
