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
- [ ] **Phase 4: Success & Quality Hardening** — `/success` confirmation panel closes the loop back to `/`, with codebase-wide TypeScript, hygiene, and dependency gates enforced

## Phase Details

### Phase 1: Foundation & Shared Chrome
**Goal:** A user can navigate to every route (`/`, `/welcome`, `/permissions`, `/select-provider`, `/connecting`, `/success`) and see a Fetch-branded shell with theme, font, and chrome correctly wired — even though each route is a placeholder.
**Mode:** mvp
**Depends on:** Nothing (first phase)
**Requirements:** FOUND-01, FOUND-02, FOUND-03, FOUND-04, FOUND-05, FOUND-06, FOUND-07, UI-01, UI-02, UI-03, QUAL-04
**Success Criteria** (what must be TRUE):
  1. Running `pnpm dev` (or `npm run dev`) starts the server on port 3001, and `package.json` has no Tailwind / shadcn / lucide-react / class-variance-authority dependencies installed
  2. Navigating to any of `/`, `/welcome`, `/permissions`, `/select-provider`, `/connecting`, `/success` renders a placeholder screen wrapped in the shared `FlowLayout` (centered white Paper, `#EBF5FF` background, 12px radius, soft shadow, min-height 100vh) with the `FetchLogo` visible
  3. Inter font from `next/font/google` is applied to body text (verifiable via DevTools computed font-family), and MUI theme primary `#2463EC` plus the full brand token palette (surfaces, text, success/warning/danger) drives component colors
  4. Importing from `src/lib/providers.ts` returns four entries (Gusto `#F45D48`, ADP `#D90429`, Paycom `#003DA5`, Rippling `#F5A623`) and a rendered `PermissionItem` shows a blue checkmark + bold label + muted description in one row
  5. No flicker on hard reload — `AppRouterCacheProvider` + `ThemeProvider` + `CssBaseline` are wired in `app/layout.tsx` and SSR delivers themed markup
**Plans:** 3/3 plans executed
Plans:
- [x] 01-01-PLAN.md — Scaffold Next.js 15 + MUI + Emotion, brand-token theme, root layout (FOUND-01, FOUND-02, FOUND-03, FOUND-04, FOUND-05, QUAL-04)
- [x] 01-02-PLAN.md — Provider catalog + shared chrome components (FlowLayout, FetchLogo, PermissionItem) (FOUND-07, UI-01, UI-02, UI-03)
- [x] 01-03-PLAN.md — Six route stubs wired to shared chrome; end-to-end skeleton smoke test (FOUND-06)
**UI hint:** yes

### Phase 2: Pre-Provider Flow
**Goal:** A user landing on `/` is carried through the trust narrative — splash animation → welcome explainer → permissions disclosure — without seeing any placeholder content.
**Mode:** mvp
**Depends on:** Phase 1
**Requirements:** FLOW-01, FLOW-02, FLOW-03
**Success Criteria** (what must be TRUE):
  1. Visiting `/` shows the Fetch logo centered on `#EBF5FF` with tagline "Retirement runs on Fetch", logo scales in over 500ms then breathes on a 2s cycle, and auto-redirects to `/welcome` after ~2500ms
  2. `/welcome` shows a centered 440px-wide white panel (48px padding) with Fetch logo, heading "Connect your payroll provider", explanatory body copy, and a primary "Get Started" button that navigates to `/permissions`
  3. `/permissions` shows a centered 768px-wide white panel with Fetch logo, heading "To connect your payroll, Fetch will need access to:", and a 2-column grid of six `PermissionItem`s (Organization, Team, Employment / Payroll, Pay Statement, SSN) with correct labels and descriptions
  4. On `/permissions`, the "Back" outlined button returns to `/welcome` and the "Continue" primary button advances to `/select-provider` — both are real navigations, no dead buttons
**Plans:** 4/4 plans executed
Plans:
- [x] 02-01-PLAN.md — Widen FlowLayout padding API to px/py (theme-spacing units); resolves Phase 1 REVIEW WR-01/WR-02
- [x] 02-02-PLAN.md — `/` splash with logo + tagline + 500ms scale-in + 2s breathing + auto-redirect to `/welcome` (FLOW-01)
- [x] 02-03-PLAN.md — `/welcome` 440px panel with heading + body copy + primary 'Get Started' button → `/permissions` (FLOW-02)
- [x] 02-04-PLAN.md — `/permissions` 768px panel with 2x3 PermissionItem grid + Back (outlined) → `/welcome` + Continue (primary) → `/select-provider` (FLOW-03)
**UI hint:** yes

### Phase 3: Provider Selection & Connecting Bridge
**Goal:** A user can pick a payroll provider, see realistic submission feedback, and be carried through the connecting bridge to the success route — with invalid entry to `/connecting` redirecting back to selection.
**Mode:** mvp
**Depends on:** Phase 2
**Requirements:** FLOW-04, FLOW-05, FLOW-06, FLOW-07
**Success Criteria** (what must be TRUE):
  1. `/select-provider` shows a centered 498px-wide white panel with Fetch logo, heading "Select your payroll provider", body copy, and an MUI `Select` labeled "Select Payroll Provider" listing the four providers from the catalog
  2. The "Connect" primary button is disabled until a provider is chosen, and the "Back" outlined button (fixed ~100px width) returns to `/permissions`
  3. Clicking "Connect" swaps the button into a ~1.2s loading state (spinner + "Connecting…"), then navigates to `/connecting?provider={slug}` with the selected provider's slug
  4. `/connecting?provider={validSlug}` shows a centered white panel with Fetch logo, `CircularProgress` spinner, heading "Establishing connection…", body "Connecting to {providerName}. You'll be redirected to sign in.", and auto-advances to `/success` after ~2500ms
  5. Visiting `/connecting` with no `?provider=` or an unknown slug redirects immediately to `/select-provider`
**Plans:** 2/2 plans complete
Plans:
- [x] 03-01-PLAN.md — `/select-provider` 498px panel with FetchLogo + heading + body + MUI Select (sourced from providers catalog) + Back (outlined, fixed ~100px → /permissions) + Connect (primary, flex-1, disabled until selection, ~1.2s loading state) → /connecting?provider={slug} (FLOW-04, FLOW-05)
- [x] 03-02-PLAN.md — `/connecting` panel with FetchLogo + CircularProgress + 'Establishing connection…' heading + interpolated provider-name body; query-param guard (missing/invalid → router.replace('/select-provider')); 2500ms auto-advance via router.replace('/success') (FLOW-06, FLOW-07)
**UI hint:** yes

### Phase 4: Success & Quality Hardening
**Goal:** A user reaches an on-brand success confirmation that loops back to `/`, and the codebase passes the project's strict TypeScript, hygiene, navigation, and dependency gates.
**Mode:** mvp
**Depends on:** Phase 3
**Requirements:** FLOW-08, QUAL-01, QUAL-02, QUAL-03
**Success Criteria** (what must be TRUE):
  1. `/success` shows a Fetch-branded centered white panel with a green checkmark icon using the `#10B981` success token, heading "Connected successfully", short confirmation body copy, and a "Done" button that navigates back to `/`
  2. End-to-end demo run from `/` → `/welcome` → `/permissions` → `/select-provider` → `/connecting?provider=gusto` → `/success` → `/` completes without dead buttons, errors, or placeholder content
  3. `tsc --noEmit` (or equivalent strict TypeScript check) passes with zero `any` types across `src/`
  4. Repo-wide grep for `console.log` returns zero hits in committed code, and `package.json` confirms Tailwind / shadcn / lucide-react / CVA remain absent
**Plans:** TBD
**UI hint:** yes

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Shared Chrome | 3/3 | Complete | 2026-05-18 |
| 2. Pre-Provider Flow | 4/4 | Complete | 2026-05-18 |
| 3. Provider Selection & Connecting Bridge | 2/2 | Complete   | 2026-05-18 |
| 4. Success & Quality Hardening | 0/0 | Not started | - |

## Coverage Validation

**v1 Requirements mapped:** 22/22

| Category | Count | Phase Distribution |
|----------|-------|--------------------|
| Foundation (FOUND-01..07) | 7 | All in Phase 1 |
| Shared UI (UI-01..03) | 3 | All in Phase 1 |
| Flow Screens (FLOW-01..08) | 8 | FLOW-01..03 in Phase 2; FLOW-04..07 in Phase 3; FLOW-08 in Phase 4 |
| Quality (QUAL-01..04) | 4 | QUAL-04 in Phase 1 (dependency gate set at scaffolding); QUAL-01..03 in Phase 4 (codebase-wide gates) |

**Orphans:** None
**Duplicates:** None

## Notes

- **Rationale for coarse 4-phase shape:** The spec's own implementation order (Setup → Shared chrome → Splash → Welcome → Permissions → Select Provider → Connecting → Success) clusters into four natural delivery boundaries: (1) foundation that makes every route reachable, (2) the pre-decision narrative, (3) the decision + bridge, (4) the closer + hardening. Each phase ships a navigable demo state.
- **MVP vertical-slice intent:** Phase 1 deliberately ships routable placeholder content under the real `FlowLayout` chrome so every subsequent phase is *swapping stubs for the real screen* rather than carving new routes. This honors the project mode constraint of an end-to-end vertical slice from day one.
- **QUAL-04 placement:** Dependency-exclusion gate sits in Phase 1 because the moment of risk is scaffolding — if Tailwind/shadcn sneak in during setup, they'll metastasize. QUAL-01..03 stay in Phase 4 because TypeScript-strict, no-console, and no-dead-buttons can only be meaningfully verified once the whole codebase exists.
- **Decimal-phase room reserved:** If a UI safety review or design polish pass emerges during execution, it can land as a 4.1 insertion rather than disturbing the four-phase backbone.

---
*Last updated: 2026-05-18 after completing Plan 03-02 (FLOW-06 + FLOW-07 satisfied — `/connecting` 440px panel with FetchLogo + `CircularProgress` + heading "Establishing connection…" + body "Connecting to {providerName}. You'll be redirected to sign in." with the catalog `name` interpolated; reads `?provider=` via `useSearchParams`; missing/invalid slugs render null and `router.replace('/select-provider')`; valid slugs auto-advance via `router.replace('/success')` after 2500ms with a `useEffect` cleanup that clears the pending timer on unmount; `export const dynamic = 'force-dynamic'` opts the route out of static prerendering; both navigations use `router.replace` because the transient bridge route must not sit in browser history). **Phase 3 now complete (2/2 plans);** the full demo flow `/` → `/welcome` → `/permissions` → `/select-provider` → `/connecting` → `/success` is navigable end-to-end with only `/success` remaining a Phase 1 stub. Phase 4 (FLOW-08 + QUAL-01..03) is next.*
