# Requirements: Fetch Gateway (MUI Rebuild)

**Defined:** 2026-05-18
**Core Value:** A polished, on-brand five-step demo flow that takes the user from splash → success without any real OAuth, API calls, or credential entry into Fetch.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Foundation

- [x] **FOUND-01**: Next.js 15 App Router project with TypeScript, `src/` directory, strict typing (no `any`)
- [x] **FOUND-02**: Dev server runs on port 3001 (configured in `package.json`)
- [x] **FOUND-03**: MUI theme in `src/theme/theme.ts` encodes brand tokens (primary `#2463EC`, page bg `#EBF5FF`, panel `#FFFFFF`, text `#101827`/`#6B7280`, border `#E5E7EB`, success `#10B981`, warning `#F59E0B`, danger `#EF4444`)
- [x] **FOUND-04**: Root `app/layout.tsx` wires `ThemeProvider` + `AppRouterCacheProvider` (`@mui/material-nextjs/v15-appRouter`) + `CssBaseline`
- [x] **FOUND-05**: Inter font loaded via `next/font/google` as `--font-inter` CSS variable, applied to body
- [x] **FOUND-06**: Route stubs exist for all 6 routes: `/`, `/welcome`, `/permissions`, `/select-provider`, `/connecting`, `/success`
- [x] **FOUND-07**: Provider catalog in `src/lib/providers.ts` (Gusto `#F45D48`, ADP `#D90429`, Paycom `#003DA5`, Rippling `#F5A623`) — single source of truth for provider data

### Shared UI

- [x] **UI-01**: `FlowLayout` component centers content on `#EBF5FF` background, hosts a white Paper/Card with `borderRadius: 12px` and soft shadow (`0 2px 8px rgba(0,0,0,0.08)`), `min-height: 100vh`
- [x] **UI-02**: `FetchLogo` component renders the Fetch logo as `<img>` or inline SVG (not via icon library), sized via prop (default 100px)
- [x] **UI-03**: `PermissionItem` component renders a blue checkmark icon, bold label, and muted description in one row

### Flow Screens

- [x] **FLOW-01**: `/` splash auto-redirects to `/welcome` after 2500ms; shows Fetch logo centered on `#EBF5FF` with tagline "Retirement runs on Fetch"; logo scales in over 500ms then breathes (2s cycle) until redirect
- [x] **FLOW-02**: `/welcome` displays a centered white panel (max-width 440px, 48px padding) with Fetch logo (100px), heading "Connect your payroll provider", explanatory body copy, and a primary "Get Started" button routing to `/permissions`
- [x] **FLOW-03**: `/permissions` displays a centered white panel (max-width 768px, 48px horizontal padding) with Fetch logo, heading "To connect your payroll, Fetch will need access to:", a 2-column grid of 6 `PermissionItem`s (Organization, Team, Employment / Payroll, Pay Statement, SSN), and "Back" (outlined → `/welcome`) and "Continue" (primary → `/select-provider`) buttons side by side
- [x] **FLOW-04**: `/select-provider` displays a centered white panel (max-width 498px) with Fetch logo, heading "Select your payroll provider", body copy, an MUI `Select` labeled "Select Payroll Provider" sourced from the provider catalog, plus "Back" (outlined, fixed ~100px) and "Connect" (primary, flex-1, disabled until a provider is selected) buttons
- [x] **FLOW-05**: On `/select-provider` "Connect" click, button shows ~1.2s loading state (spinner + "Connecting…") then navigates to `/connecting?provider={slug}`
- [x] **FLOW-06**: `/connecting` reads `?provider=` from query params, displays a centered white panel with Fetch logo, `CircularProgress` spinner, heading "Establishing connection…", and body copy "Connecting to {providerName}. You'll be redirected to sign in."; auto-advances to `/success` after ~2500ms
- [x] **FLOW-07**: `/connecting` redirects to `/select-provider` if `?provider=` is missing or does not match the provider catalog
- [x] **FLOW-08**: `/success` displays a Fetch-branded centered white panel with a green checkmark icon (using success token `#10B981`), heading "Connected successfully", short confirmation body copy, and a "Done" button routing back to `/`

### Quality

- [x] **QUAL-01**: Zero `any` types across the TypeScript codebase
- [x] **QUAL-02**: No `console.log` statements in committed code
- [x] **QUAL-03**: All navigation buttons land on a real route — no dead buttons
- [x] **QUAL-04**: No Tailwind, shadcn, lucide-react, or class-variance-authority dependencies installed
- [x] **QUAL-05**: All design values in src/ trace to theme.ts tokens (the Figma "Fetch Design System", key pZYTXYGKR5lJAcaE0SnzLV); no off-token hex or raw px outside theme.ts (provider brand colors in src/lib/providers.ts are catalog data, not design tokens); enforced by `npm run lint:tokens`. The px rule targets CSS-style `Npx` string literals, not bare SVG numeric attributes.

## v2 Requirements

Milestone v2 — "Connection flow v2": Select-Provider FIRST, then a "How do you want to connect?" decision, branching into a self path (with 2FA when required) and a delegate path (invite a teammate). Source of truth: Figma COPY file `is2HhftlhJsdorY0J7zKdr`, canvas "Connection flow v2" (node 2068:70). Spec mirrored to `.planning/v2/V2-FIGMA-SPEC.md`. All v2 screens are assembled from the Phase-A DS components and obey QUAL-05 (zero off-token hex/px).

- [x] **FLOW-09** (Stage 1 ✓): NEW `/connect-method?provider={slug}` decision screen — FetchLogo + h5 "How do you want to connect {Provider}?" + body2 subtitle, then two DS `OptionRow`s: "I'll connect it now / I have access to {Provider}" → self → `/connecting?provider=`; "Someone on my team manages it / We'll send them a secure link to connect" → delegate → `/invite?provider=`. `/select-provider` Continue now routes here (not directly to `/connecting`). Provider resolved from catalog via `?provider=` with the standard Suspense + redirect guard.
- [x] **FLOW-11** (Stage 2 ✓): self-branch 2FA — `/connecting` routes to NEW `/verify?provider={slug}` when the demo flag `?2fa=1` is present, else straight to `/success`. `/verify` = h5 "Enter verification code" + 6-cell OTP built from token-styled `Box` primitives (no DS OTP component; `tokens.radius.md`, `divider` cells / active cell `secondary.main` navy 2px) + "Verify" Button → `/success` + navy "Resend code" Link. Self OptionRow on `/connect-method` carries `&2fa=1` to demo the full path; omitting it is the no-2FA variant.
- [x] **FLOW-08** (backfilled in Stage 2 ✓): `/success` terminal screen — was recorded complete in Phase 4 but never existed on disk (404). Created from Figma 2069:145: FetchLogo + 56px `CheckCircleRounded` (success.main) + h5 "You’re connected" + body2 sync copy + primary "Continue" Button → `/`. Now the self path's real terminus.
### Credential card (Phase 08) — credential entry as a flow card

- [x] **CRED-01** (Phase 08 ✓): Principal/SFTP self-path credential entry is a flow CARD (`/credentials?provider=`) visually identical to `/verify` (FlowLayout + FetchLogo + title + fields + Continue + Back), replacing the old MUI Dialog modal. Principal: Email+Password "Sign in to Principal" → /connecting?&2fa=1 → /verify → /success. SFTP: Host+Username+Password "Connect via SFTP" (per Figma 8:365) → /connecting → /success. `/connect-method` rewired so `/connecting` is only reached after credential submit (Gusto unchanged → /gusto-login). Commit 3fba51e.

### Connection re-align (Phase 07) — match current Figma "Connection flows" (477:453)

Re-align the 10 connection-flow screens to the current Figma; preserve per-type self behavior. Spec: `.planning/phases/07-connection-realign/REALIGN-SPEC.md`.

- [x] **REALIGN-01** (Phase 07 ✓): pre-provider screens — /welcome ("Connect your payroll data"), /permissions (640px, "Fetch will need access to:", 2-col check-circle icons), /select-provider ("What do you want to connect?" + DS Input dropdown w/ "Connection" label + chevron, replacing the tonal grey Select).
- [x] **REALIGN-02** (Phase 07 ✓): connection screens — /connect-method, /connecting, /verify (OTP active cell purple primary.main), /success (green success.main circle + white check).
- [x] **REALIGN-03** (Phase 07 ✓): delegate screens — /invite (Back+Send actions row), /invitation-sent (no Pending chip / no mark per node), /recipient (no caption); + home Connection-flow description "payroll provider" → "payroll system".

### Demo home (Phase 06) — launcher + tangible connection types

A demo launcher at `/` and realistic credential flows for the 3 connection types. Spec: `.planning/phases/06-demo-home/DEMO-HOME-SPEC.md`. Fetch UI = DS/theme/tokens; the Gusto mock is a scoped bespoke exception.

- [x] **DEMO-01** (Phase 06 ✓): demo home launcher at `/` (repurposes the splash) — FlowLayout + FetchLogo + 3 DS `OptionRow`s: join existing org → `/sign-up?org=existing`; create new org → `/sign-up`; Connection flow → `/welcome`. Commit ef8b114.
- [x] **DEMO-02** (Phase 06 ✓): bespoke Gusto mock `/gusto-login` (recreated from user images: Gusto sign-in → OAuth authorize consent → `/connecting?provider=gusto` → `/success`). Gusto hex scoped to that file; `lint:tokens` excludes `src/app/gusto-login`. Commit 1b94009.
- [x] **DEMO-03** (Phase 06 ✓): connection-type realism on the self path — Gusto (redirect) → `/gusto-login`; SFTP (sftp) modal fields per Figma `q2KVTdgfZaHTwViNlMdpb1` 8:365 (Host / Username or Email / Password + "encrypted, never stored" note); Principal (credentials) → creds modal → 2FA → success (confirmed). Commit 1821a96.

### Auth flows (Phase 05) — Playground auth screens (Figma file pZYTXYGKR5lJAcaE0SnzLV)

Eight `'use client'` routes assembled from DS components (FlowLayout/FetchLogo/Input/Button/Link). `/` stands in for the signed-in app landing (no dashboard yet). Spec: `.planning/phases/05-auth-flows/AUTH-FLOWS-SPEC.md`.

- [x] **AUTH-01** (Phase 05 ✓): `/sign-in` (459:145 — email/password, Forgot-password link, Sign-up link → /) and `/sign-up` (459:174 — work email, connection code, password, confirm; "Create account" branches on the `?org=existing` demo flag → /join-organization, else → /create-organization). Commit bdd91de.
- [x] **AUTH-02** (Phase 05 ✓): `/join-organization` (459:204 — "Request to join" → /, "Use a different email" → /sign-up) and `/create-organization` (460:214 — org-name Input, "Create organization" → /). Commit 5d58d40.
- [x] **AUTH-03** (Phase 05 ✓): password recovery — `/forgot-password` (460:232 → /check-email) → `/check-email` (460:252 — "Back to sign in", "Resend link", demo "Open the reset link" → /set-new-password) → `/set-new-password` (460:267 → /password-updated) → `/password-updated` (474:273 — green "Password updated" title per Figma, NO checkmark icon; "Continue to sign in" → /sign-in). Commit 6a32d62.

- [x] **FLOW-10** (Stage 3 ✓): delegate branch — NEW `/invite?provider={slug}` (3 controlled DS `Input`s: work email, name optional, note optional; "Send invite" Button → `/invitation-sent`, navy "Back" Link → `/connect-method`); NEW `/invitation-sent?provider={slug}` (navy `CheckCircleRounded` mark + DS `Chip severity="warning" label="Pending"`, "Done" Button → `/`, "Resend invite" Link → `/invite`, demo Link "Open the invite as the teammate" → `/recipient`); NEW `/recipient?provider={slug}` (read-only "Plantegrity asked you to connect {Provider}", "Get Started" Button → `/connecting?provider=…&2fa=1`, reusing the self tail Establishing → 2FA → Success). All three: Suspense + providers guard; assembled from DS components; lint:tokens green.

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| `/provider-sign-in` Gusto-styled mock | Removed per current scope decision — no credential entry, no provider-branded UI in v1 |
| `/provider-authorize` OAuth consent mock | Removed alongside provider sign-in — the consent UX isn't part of the demo wedge |
| `/dashboard` PlanTegrity Admin success screen | Replaced by simpler Fetch-branded `/success` page; keeps success moment on-brand for Fetch |
| Real OAuth or real provider API calls | Demo is fully mocked end-to-end |
| Persistence (localStorage, cookies, server state) | Flow is stateless beyond URL query params |
| Mobile / responsive layout | Desktop only at 1440px target |
| Tailwind, shadcn, lucide-react, CVA | MUI is the exclusive UI library per spec |
| Porting from older prototype at `~/Documents/ai-ui-lab/Fetch Gateway/` | Visual reference only — recreate from scratch on MUI |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1: Foundation & Shared Chrome | Complete |
| FOUND-02 | Phase 1: Foundation & Shared Chrome | Complete |
| FOUND-03 | Phase 1: Foundation & Shared Chrome | Complete |
| FOUND-04 | Phase 1: Foundation & Shared Chrome | Complete |
| FOUND-05 | Phase 1: Foundation & Shared Chrome | Complete |
| FOUND-06 | Phase 1: Foundation & Shared Chrome | Complete |
| FOUND-07 | Phase 1: Foundation & Shared Chrome | Complete |
| UI-01 | Phase 1: Foundation & Shared Chrome | Complete |
| UI-02 | Phase 1: Foundation & Shared Chrome | Complete |
| UI-03 | Phase 1: Foundation & Shared Chrome | Complete |
| FLOW-01 | Phase 2: Pre-Provider Flow | Complete |
| FLOW-02 | Phase 2: Pre-Provider Flow | Complete |
| FLOW-03 | Phase 2: Pre-Provider Flow | Complete |
| FLOW-04 | Phase 3: Provider Selection & Connecting Bridge | Complete |
| FLOW-05 | Phase 3: Provider Selection & Connecting Bridge | Complete |
| FLOW-06 | Phase 3: Provider Selection & Connecting Bridge | Complete |
| FLOW-07 | Phase 3: Provider Selection & Connecting Bridge | Complete |
| FLOW-08 | Phase 4: Success & Quality Hardening | Complete |
| QUAL-01 | Phase 4: Success & Quality Hardening | Complete |
| QUAL-02 | Phase 4: Success & Quality Hardening | Complete |
| QUAL-03 | Phase 4: Success & Quality Hardening | Complete |
| QUAL-04 | Phase 1: Foundation & Shared Chrome | Complete |
| QUAL-05 | Quick 260608-nk0 (DS token source of truth) | Complete |

**Coverage:**
- v1 requirements: 22 total
- Mapped to phases: 22 ✓
- Unmapped: 0
- Complete: 22 ✓ (v1 milestone shippable)
- Post-v1 quality requirement added: QUAL-05 (Figma DS token source of truth, enforced by `npm run lint:tokens`) — Quick 260608-nk0.

---
*Requirements defined: 2026-05-18*
*Last updated: 2026-05-18 after Plan 04-02 codebase-wide quality-gate audit — QUAL-01..03 satisfied (zero `: any` in src/, zero `console.log()` call sites in code-file extensions, no dead navigation buttons, full edge graph validated against /); all 22/22 v1 requirements complete; v1 milestone shippable.*
