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
- [ ] **FLOW-08**: `/success` displays a Fetch-branded centered white panel with a green checkmark icon (using success token `#10B981`), heading "Connected successfully", short confirmation body copy, and a "Done" button routing back to `/`

### Quality

- [ ] **QUAL-01**: Zero `any` types across the TypeScript codebase
- [ ] **QUAL-02**: No `console.log` statements in committed code
- [ ] **QUAL-03**: All navigation buttons land on a real route — no dead buttons
- [x] **QUAL-04**: No Tailwind, shadcn, lucide-react, or class-variance-authority dependencies installed

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

(None — scope is fully captured in v1.)

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
| FLOW-08 | Phase 4: Success & Quality Hardening | Pending |
| QUAL-01 | Phase 4: Success & Quality Hardening | Pending |
| QUAL-02 | Phase 4: Success & Quality Hardening | Pending |
| QUAL-03 | Phase 4: Success & Quality Hardening | Pending |
| QUAL-04 | Phase 1: Foundation & Shared Chrome | Complete |

**Coverage:**
- v1 requirements: 22 total
- Mapped to phases: 22 ✓
- Unmapped: 0

---
*Requirements defined: 2026-05-18*
*Last updated: 2026-05-18 after Plan 03-01 verification — FLOW-04 + FLOW-05 satisfied; 16/22 v1 requirements complete (FOUND-01..07, UI-01..03, QUAL-04, FLOW-01..05)*
