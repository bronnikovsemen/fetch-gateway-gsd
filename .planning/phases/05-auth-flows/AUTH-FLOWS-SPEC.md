# Phase 05 — Auth Flows — Figma Spec (authoritative)

Pulled live from Figma "Fetch Design System" (`pZYTXYGKR5lJAcaE0SnzLV`), Playground auth screens, on 2026-06-09. Figma is authoritative over the task text. Assemble from existing DS components only: `FlowLayout`, `FetchLogo`, `Input`, `Button`, `Link`. No raw MUI where a DS component exists (MUI `Box`/`Stack`/`Typography` for layout/text is fine).

## Shared chrome (every screen)
- `FlowLayout maxWidth={400} px={4} py={4}` (32px padding), `Stack spacing={3}` (24px gaps), `alignItems: 'center'`.
- Header: `<FetchLogo size={40} />` (per task: use FetchLogo, NOT the Figma AuthLogoCluster wordmark+tagline — logo/tagline reconciliation tracked separately).
- Title: `Typography variant="h5" component="h1"` (or h2 in modals), `color: 'text.primary'`, `textAlign: 'center'`.
- Subtitle (when present): `Typography variant="body2"`, `color: 'text.secondary'`, `textAlign: 'center'`.
- Primary action: DS `Button` (variant primary, `sx={{ width: '100%' }}`).
- Inline links: DS `Link` (navy `secondary.main`); the Figma auth links are 13/20 → use `size="sm"`. Bottom helper text ("Don't have an account?") is 12/16 → `Typography variant="caption"` (text.secondary).
- Inputs: DS `Input` (controlled `useState`, fullWidth default).
- Only `/sign-up` reads a query param → Suspense + `useSearchParams` pattern from `/connect-method`. The other 7 are plain `'use client'` pages (no param guard needed).

## "/" landing
`/` (splash) stands in for the signed-in/app landing — there is no dashboard yet. Buttons that "complete" auth (Sign in, Request to join, Create organization) navigate to `/`. **Documented stand-in.**

---

## Routes

### 1. `/sign-in` — Figma 459:145 (AUTH-01)
- Title "Sign in to Fetch".
- DS `Input` "Email" (placeholder `you@acme.com`), DS `Input` "Password" type="password".
- A right-aligned row holding DS `Link size="sm"` "Forgot password?" → `/forgot-password` (`Box`/`Stack` `alignSelf: 'flex-end'` or row `justifyContent: 'flex-end'`).
- DS `Button` "Sign in" → `/`.
- Bottom centered row: caption "Don’t have an account?" + `Link size="sm"` "Sign up" → `/sign-up`.

### 2. `/sign-up` — Figma 459:174 (AUTH-01)  ← Suspense + useSearchParams (`?org`)
- Title "Create your account".
- DS `Input`s (controlled), in Figma order: "Work email" (placeholder `you@acme.com`), **"Connection code"** (Figma adds this — placeholder e.g. `025118`), "Password" type="password", "Confirm password" type="password".
- DS `Button` "Create account" → **branch on the demo flag**: `?org=existing` → `/join-organization`; otherwise → `/create-organization`. (Document both URLs: `/sign-up` = create-org path; `/sign-up?org=existing` = join-org path.)
- Bottom centered row: caption "Already have an account?" + `Link size="sm"` "Sign in" → `/sign-in`.

### 3. `/join-organization` — Figma 459:204 (AUTH-02)
- Title "Join Acme Inc."; subtitle "An organization already exists for acme.com. Request access to join your team."
- DS `Button` "Request to join" → `/`.
- Centered DS `Link size="sm"` "Use a different email" → `/sign-up`.

### 4. `/create-organization` — Figma 460:214 (AUTH-02)
- Title "Create your organization"; subtitle "We couldn’t find an organization for acme.com. Set one up to get started."
- DS `Input` "Organization name" (placeholder `Acme Inc.`).
- DS `Button` "Create organization" → `/`.

### 5. `/forgot-password` — Figma 460:232 (AUTH-03)
- Title "Reset your password"; subtitle "Enter your email and we’ll send you a reset link."
- DS `Input` "Email" (placeholder `you@acme.com`).
- DS `Button` "Send reset link" → `/check-email`.
- Centered DS `Link size="sm"` "Back to sign in" → `/sign-in`.

### 6. `/check-email` — Figma 460:252 (AUTH-03)
- Title "Check your email"; subtitle "We sent a reset link to you@acme.com. It expires in 30 minutes."
- DS `Button` "Back to sign in" → `/sign-in`.
- Centered DS `Link size="sm"` "Resend link" → `/check-email`.
- **PLUS** a demo DS `Link size="sm"` "Open the reset link (demo)" → `/set-new-password` (makes the next step click-reachable; not in Figma — task addition).

### 7. `/set-new-password` — Figma 460:267 (AUTH-03)
- Title "Set a new password"; subtitle "Choose a new password for your account."
- DS `Input` "New password" type="password", DS `Input` "Confirm password" type="password".
- DS `Button` "Update password" → `/password-updated`.

### 8. `/password-updated` — Figma 474:273 (AUTH-03)
- **Figma divergence from task:** Figma shows NO checkmark icon — the title "Password updated" is rendered in **success green** (`success.main`). The task asked for a `CheckCircleRounded` mark. Per "Figma is authoritative," follow Figma: `Typography variant="h5"` "Password updated" with `color: 'success.main'`, centered. (Flag in SUMMARY; a CheckCircleRounded mark can be added later if preferred.)
- Subtitle "You can now sign in with your new password." (body2, text.secondary).
- DS `Button` "Continue to sign in" → `/sign-in`.

---

## Navigation graph (acceptance)
```
/sign-in ──"Sign up"──▶ /sign-up ──"Sign in"──▶ /sign-in
/sign-in ──"Forgot password?"──▶ /forgot-password ──"Send reset link"──▶ /check-email
   /check-email ──"Open the reset link (demo)"──▶ /set-new-password ──▶ /password-updated ──"Continue to sign in"──▶ /sign-in
   /forgot-password ──"Back to sign in"──▶ /sign-in
/sign-up            ──"Create account"──▶ /create-organization ──▶ /
/sign-up?org=existing ──"Create account"──▶ /join-organization ──▶ /  (or "Use a different email" → /sign-up)
/sign-in "Sign in" ──▶ /   (landing stand-in)
```
No dead buttons — every button/link navigates or performs a real action (Resend link re-loads /check-email).

## Constraints
MUI v9 + Emotion only; no Tailwind/shadcn/lucide; strict TS (no `any`); no console.log; FetchLogo image/SVG; theme/tokens only — zero off-token hex/raw px (lint:tokens green); no new deps; port 3001.

## Requirements (added to REQUIREMENTS.md)
- **AUTH-01** — `/sign-in` + `/sign-up` (with ?org demo branch).
- **AUTH-02** — `/join-organization` + `/create-organization`.
- **AUTH-03** — password recovery: `/forgot-password` → `/check-email` → `/set-new-password` → `/password-updated`.

## Out of scope
Real auth/session/email; a dashboard/app landing (uses `/`); the Figma AuthLogoCluster tagline; field validation beyond controlled inputs.
