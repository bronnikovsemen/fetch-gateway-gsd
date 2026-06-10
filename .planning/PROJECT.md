# Fetch Gateway (MUI Rebuild)

## What This Is

Fetch Gateway is a demo prototype of the Fetch embedded connect flow. A launcher at `/` offers three flows: two sign-up paths (join / create organization) and a connection flow with three connection types — Gusto (redirect to a mock Gusto OAuth), Principal (credential card + SMS 2FA), SFTP (host + credentials). Connections can be delegated to a teammate, routed by the same auth method. Credentials for Principal/SFTP are entered on Fetch-side cards; everything is mocked.

## Core Value

A polished, on-brand demo flow that takes the user from the launcher through sign-up and connection paths to a success screen, with no real OAuth, API calls, or credential storage. The flow must look production-quality at a 1440px desktop target.

## Requirements

### Validated

- [x] Shared `FlowLayout` and `FetchLogo` components centralize the Fetch-branded chrome (centered white Paper, `#EBF5FF` page background, 12px radius, soft shadow) — *Validated in Phase 1: Foundation & Shared Chrome*
- [x] Provider catalog lives in `src/lib/providers.ts` (slug / name / brandColor) — every provider reference reads from here — *Validated in Phase 1*
- [x] MUI theme in `src/theme/theme.ts` encodes the brand tokens (primary `#2463EC`, surfaces, text colors, success/warning/danger) and is wired through `ThemeProvider` + `AppRouterCacheProvider` + `CssBaseline` via a client `ThemeRegistry` in `app/layout.tsx` — *Validated in Phase 1*
- [x] Inter font loaded via `next/font/google` as `--font-inter` and applied to body — *Validated in Phase 1*
- [x] Dev server runs on port **3001** — *Validated in Phase 1*
- [x] All six routes (`/`, `/welcome`, `/permissions`, `/select-provider`, `/connecting`, `/success`) reachable as placeholders wrapped in `FlowLayout` with `FetchLogo` visible — *Validated in Phase 1*
- [x] Splash screen at `/` auto-redirects to `/welcome` after ~2.5s with logo scale-in + breathing animation — *Validated in Phase 2: Pre-Provider Flow*
- [x] Welcome screen at `/welcome` explains the Plantegrity ↔ payroll connection and routes to `/permissions` — *Validated in Phase 2*
- [x] Permissions screen at `/permissions` displays a 2×3 grid of the six permission scopes (Organization, Team, Employment, Payroll, Pay Statement, SSN) and routes to `/select-provider` — *Validated in Phase 2*
- [x] Select-provider screen at `/select-provider` offers an MUI Select with 4 providers (Gusto, ADP, Paycom, Rippling), shows a "Connecting…" loading state on submit, and routes to `/connecting?provider={slug}` — *Validated in Phase 3: Provider Selection & Connecting Bridge (FLOW-04, FLOW-05; human UAT outstanding)*
- [x] Connecting screen at `/connecting` shows a spinner and provider-name copy, auto-advancing to `/success` after ~2.5s (reads `?provider=`, redirects to `/select-provider` if missing/invalid) — *Validated in Phase 3 (FLOW-06, FLOW-07; human UAT outstanding)*

### Active

- [ ] Success screen at `/success` displays a Fetch-branded confirmation panel with a green checkmark, "Connected successfully" heading, and a "Done" button back to `/`

## Current State

Phase 3 (Provider Selection & Connecting Bridge) automated checks complete — the demo flow `/` → `/welcome` → `/permissions` → `/select-provider` → `/connecting` → `/success` is navigable end-to-end (only `/success` remains a Phase 1 stub). FLOW-04..07 satisfied by static + SSR-smoke evidence (11/11 must-haves verified, 0 critical / 2 warning / 6 info code-review findings). Five visual/temporal qualities — Connect loading-state animation, `/connecting` spinner motion, transient-route history behavior, invalid-slug no-flash perception, and end-to-end 1440px polish — remain in `03-HUMAN-UAT.md` pending live-browser confirmation. Phase 4 (Success & Quality Hardening) is next.

### Out of Scope

- `/provider-sign-in` Gusto-styled mock screen — removed per current scope decision (no credential entry, no provider-branded UI in v1)
- `/provider-authorize` OAuth consent mock — removed per same scope decision
- `/dashboard` PlanTegrity Admin success screen — replaced by simpler Fetch-branded `/success` page
- Real OAuth or real provider API calls — flow is fully mocked
- Persistence (localStorage, cookies, server state) — every navigation is stateless beyond URL query params
- Mobile/responsive layout — desktop only at 1440px target
- Tailwind, shadcn, lucide-react, or any non-MUI styling/icon library
- Modifying the reference prototype at `~/Documents/ai-ui-lab/Fetch Gateway/` — read-only reference

## Context

- The older prototype at `~/Documents/ai-ui-lab/Fetch Gateway/` (Tailwind + shadcn) is the visual and behavioural reference. Recreate from scratch here using MUI primitives — do not port code or modify the original.
- All Fetch-branded screens share a centered white Paper layout on `#EBF5FF`. The shared `FlowLayout` component owns that chrome.
- Brand tokens are pinned in the Figma "Fetch Design System" (key pZYTXYGKR5lJAcaE0SnzLV); `src/theme/theme.ts` mirrors it as the single source of truth so screens use theme keys / the exported `tokens` object rather than hardcoding colors (except provider brand colors like Gusto coral in `src/lib/providers.ts`, which are catalog data).
- **Visual change (Quick 260608-nk0, INTENDED — not a regression):** adopting the Figma DS shifts the primary accent to purple, the page background to near-white, the success color to a new green, and applies the full DS type scale. This realigns the prototype with the canonical DS and is the expected outcome of the token source-of-truth refactor.
- `AppRouterCacheProvider` from `@mui/material-nextjs/v15-appRouter` is required — MUI flickers on SSR without it.
- All navigation is mocked. No dead buttons — every Back/Next/Done lands on a real route.

## Constraints

- **Tech stack**: Next.js 15 App Router + TypeScript (`src/` directory), MUI as the only UI library, Emotion as the styling engine, `@mui/icons-material` as the only icon library — locked by spec.
- **Styling**: MUI components for all layout (`Box`, `Stack`, `Typography`, `Button`, `Card`, `Paper`, `Select`, `MenuItem`); `sx` prop for one-offs. No raw HTML layout, no Tailwind, no shadcn.
- **TypeScript**: No `any` — strict typing throughout.
- **Hygiene**: No `console.log` committed.
- **Viewport**: Desktop 1440px target — no responsive breakpoints required.
- **Port**: Dev server must run on 3001 (configured in `package.json`).
- **Logo**: Fetch logo must be `<img>` or inline SVG — not an `@mui/icons-material` substitute.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| MUI as exclusive UI library (no Tailwind, no shadcn) | Fresh rebuild to standardize on MUI and shed shadcn-specific patterns | ✓ Phase 1 |
| Skip Gusto sign-in, Gusto authorize, and PlanTegrity dashboard screens | Reduce demo to the core trust narrative: see permissions → pick provider → confirm. Eliminates provider-specific styling work and a competing brand on the success screen. | — Pending |
| Replace `/dashboard` with simpler `/success` in Fetch brand style | Keep the success moment on-brand for Fetch instead of switching to PlanTegrity chrome | ✓ Route stubbed in Phase 1 |
| Inter via `next/font/google` (CSS variable `--font-inter`) | Standard Next.js 15 font loading pattern; works with MUI theme `typography.fontFamily` | ✓ Phase 1 |
| Port 3001 for dev server | Avoid collision with sibling projects running on 3000 | ✓ Phase 1 |
| Provider catalog centralized in `src/lib/providers.ts` | Prevent provider name/color drift across screens | ✓ Phase 1 |
| MUI provider chain isolated in client `ThemeRegistry` rather than rendered inline in `app/layout.tsx` | MUI v9's `ThemeProvider` is a Client Component; passing the theme object (containing functions) across the RSC boundary fails. Canonical MUI v9 + Next 15 App Router pattern. | ✓ Phase 1 |
| `FlowLayout` exposes `px?: number` + `py?: number` as MUI theme-spacing units (not raw px) | The Phase 1 single `padding: number` prop interpolated to raw px and couldn't express `/permissions`' 36/48 split. Theme-spacing units restore type/intent alignment with MUI. | ✓ Phase 2 |
| `/` splash uses `router.push` (not `router.replace`) and `/permissions` Back uses `router.push('/welcome')` (not `router.back()`) | Documented as Warning-tier nits in `02-REVIEW.md` (WR-01/WR-02). Trust-narrative goal is unaffected; deferred polish. | ✓ Phase 2 (deferred) |
| `/connecting` auto-advance uses `router.replace` (not `router.push`); invalid/missing-slug guard uses `router.replace('/select-provider')` | `/connecting` is a transient bridge route — should not occupy a slot in browser history so Back from `/success` lands on `/select-provider`. | ✓ Phase 3 |
| `/select-provider` Connect loading state held in a `useRef` setTimeout cleared via `useEffect` cleanup | Prevent stale `router.push` after unmount mid-load (T-03-01-01 mitigation). Same shape as `/connecting`'s 2500ms timer (T-03-02-01). | ✓ Phase 3 |
| `/select-provider` `<Select MenuProps={{ disablePortal: true, keepMounted: true }}>` | Required so MUI renders MenuItems into initial SSR markup (without this, the four provider names are missing from `curl` output and the plan's live HTTP smoke gate fails). Trade-off: full provider list mounts eagerly — negligible at four items. | ✓ Phase 3 |
| Figma DS is the single source of truth for design tokens; theme.ts mirrors it; off-token hex/px forbidden in src/ (enforced by `npm run lint:tokens`) | Prior theme followed obsolete Main_Fetch_Gateway.md and screens hardcoded hex/px, causing drift from the canonical DS | ✓ Quick 260608-nk0 |
| Milestone v2: reorder the flow so Select-Provider comes BEFORE a "How do you want to connect?" decision (`/connect-method`), which branches into self vs. delegate | Real HR admins often don't hold the payroll credentials; v2 lets them connect now or delegate to a teammate via a secure link. Figma "Connection flow v2" (node 2068:70 in COPY file is2HhftlhJsdorY0J7zKdr) is authoritative. | ◐ v2 Stage 1 (`/connect-method`) |
| v2 2FA is gated by a demo query param `?2fa=1` (carried `/connecting` → `/verify`), not per-provider data | Simplest demo gate; no provider-catalog change; easy to trigger/skip when walking the flow | — v2 Stage 2 (planned) |
| v2 recipient entry is a dedicated `/recipient?provider=` route (not `/welcome?invite=`) | Clearer separation of the invited-person entry point from the primary splash; its "Continue" re-enters the normal `/permissions → /connecting → (/verify) → /success` chain | — v2 Stage 3 (planned) |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-18 after Phase 3 completion (human UAT pending)*
