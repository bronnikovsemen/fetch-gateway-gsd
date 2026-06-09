# Roadmap: Fetch Gateway (MUI Rebuild)

**Created:** 2026-05-18
**Granularity:** coarse
**Mode:** mvp
**Total Phases:** 4
**Coverage:** 22/22 v1 requirements mapped

## Core Value

A polished, on-brand five-step demo flow that takes the user from splash → success without any real OAuth, API calls, or credential entry into Fetch. Production-quality at a 1440px desktop target.

## Phases

- [x] **Phase 1: Foundation & Shared Chrome** — Next.js 15 + MUI scaffolding, theme, Inter font, provider catalog, shared `FlowLayout`/`FetchLogo`/`PermissionItem` components, and navigable route stubs for all six routes
- [x] **Phase 2: Pre-Provider Flow** — Splash auto-redirect, welcome screen, and permissions disclosure grid wire `/`, `/welcome`, `/permissions` into a coherent on-brand intro
- [x] **Phase 3: Provider Selection & Connecting Bridge** — `/select-provider` MUI Select with loading-state submit, and `/connecting` spinner with query-param guard and auto-advance (completed 2026-05-18)
- [x] **Phase 4: Success & Quality Hardening** — `/success` confirmation panel closes the loop back to `/`, with codebase-wide TypeScript, hygiene, and dependency gates enforced

### Milestone v2 — Connection flow v2 (COMPLETE 2026-06-08)

Phase A (DS components) shipped via quick tasks 260608-psx (OptionRow/Chip/Input/Link) + 260608-nk0 (token source of truth). Phase B reorders the flow and adds the self/delegate branches, assembled from those DS components. Source of truth: Figma "Connection flow v2" (node 2068:70, COPY file is2HhftlhJsdorY0J7zKdr) → `.planning/v2/V2-FIGMA-SPEC.md`. Delivered branch-at-a-time:

- [x] **v2 Stage 1: Select-Provider-first + `/connect-method` decision** (FLOW-09) — `/select-provider` Continue → new `/connect-method?provider=`; two DS `OptionRow` branches (self → `/connecting`, delegate → `/invite`). Done 2026-06-08.
- [x] **v2 Stage 2: self branch — `/verify` 2FA + `/connecting` gate + `/success`** (FLOW-11; also backfilled FLOW-08 `/success` which was missing on disk) — `?2fa=1` routes `/connecting` → `/verify` (6-cell OTP, navy active cell) → `/success`; else straight to `/success`. Commits 2e8e25d (/success), c618853 (/verify), dd0206c (gate). Done 2026-06-08.
- [x] **v2 Stage 3: delegate branch — `/invite` + `/invitation-sent` + `/recipient`** (FLOW-10) — invite form → invitation-sent (Pending chip + demo "open as teammate" link) → recipient entry → `/connecting?…&2fa=1` looping into the self tail (→ /verify → /success). Commit ff5f4c0. Done 2026-06-08.

**Milestone v2 complete.** Full flow navigable end-to-end on :3001 — both branches reach `/success`. Self: `/select-provider → /connect-method → /connecting?&2fa=1 → /verify → /success`. Delegate: `/connect-method → /invite → /invitation-sent → /recipient → /connecting?&2fa=1 → /verify → /success`. Also backfilled the missing `/success` route (FLOW-08).

### Phase 05 — Auth Flows (COMPLETE 2026-06-09, branch `auth-flows`)

Eight auth routes built from the Playground auth screens in the Fetch Design System (`pZYTXYGKR5lJAcaE0SnzLV`), assembled from DS components. `/` stands in for the signed-in landing (no dashboard yet). Spec: `.planning/phases/05-auth-flows/AUTH-FLOWS-SPEC.md`.

- [x] **AUTH-01** — `/sign-in` (459:145) + `/sign-up` (459:174, `?org=existing` branch). Commit bdd91de.
- [x] **AUTH-02** — `/join-organization` (459:204) + `/create-organization` (460:214). Commit 5d58d40.
- [x] **AUTH-03** — `/forgot-password` (460:232) → `/check-email` (460:252) → `/set-new-password` (460:267) → `/password-updated` (474:273). Commit 6a32d62.

**Plans:** 1 plan
- [x] 05-01-PLAN.md — All 8 auth routes built from DS components, fully navigable per the spec graph. All gates (tsc/lint/lint:tokens/build) PASS; deps unchanged; all 8 routes + `?org=existing` serve 200 on :3001. Figma divergence: `/password-updated` uses a green `success.main` title with no checkmark icon (Figma-authoritative).

### Phase 06 — Demo Home (in progress, branch `demo-home`)

A demo launcher at `/` to pick & run 3 flows, plus making the 3 connection types tangible (Gusto redirect → bespoke mock; Principal creds → 2FA; SFTP host+creds form per Figma). Spec: `.planning/phases/06-demo-home/DEMO-HOME-SPEC.md`.

- [ ] **DEMO-01** — demo home launcher at `/` (3 OptionRow flows: join-org, create-org, connection flow)
- [ ] **DEMO-02** — bespoke `/gusto-login` mock (sign-in → authorize → back to Fetch); lint:tokens excludes it
- [ ] **DEMO-03** — connection-type realism: Gusto → `/gusto-login`; SFTP modal per Figma 8:365; Principal creds → 2FA

**Plans:** 1 plan
- [ ] 06-01-PLAN.md — Demo home launcher (DEMO-01), bespoke 2-step `/gusto-login` Gusto mock + lint:tokens exclusion (DEMO-02), and connect-method realism: Gusto→/gusto-login rewire + SFTP modal per Figma 8:365 + Principal creds→2FA confirmed (DEMO-03). All three DEMO requirements in one autonomous plan (Wave 1).
