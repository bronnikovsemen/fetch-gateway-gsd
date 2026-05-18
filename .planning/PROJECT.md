# Fetch Gateway (MUI Rebuild)

## What This Is

Fetch Gateway is an OAuth onboarding microsite for HR/payroll admins. They land on it via a link from Plantegrity, see what data Fetch will read from their payroll provider, pick the provider, and confirm — all without typing credentials into Fetch. This repo is a fresh rebuild of an older Tailwind/shadcn prototype on **MUI (Material UI)** with Next.js 15 App Router.

## Core Value

A polished, on-brand five-step demo flow that takes the user from splash → success without any real OAuth, real API calls, or credential entry into Fetch. The flow must look production-quality at a 1440px desktop target.

## Requirements

### Validated

- [x] Shared `FlowLayout` and `FetchLogo` components centralize the Fetch-branded chrome (centered white Paper, `#EBF5FF` page background, 12px radius, soft shadow) — *Validated in Phase 1: Foundation & Shared Chrome*
- [x] Provider catalog lives in `src/lib/providers.ts` (slug / name / brandColor) — every provider reference reads from here — *Validated in Phase 1*
- [x] MUI theme in `src/theme/theme.ts` encodes the brand tokens (primary `#2463EC`, surfaces, text colors, success/warning/danger) and is wired through `ThemeProvider` + `AppRouterCacheProvider` + `CssBaseline` via a client `ThemeRegistry` in `app/layout.tsx` — *Validated in Phase 1*
- [x] Inter font loaded via `next/font/google` as `--font-inter` and applied to body — *Validated in Phase 1*
- [x] Dev server runs on port **3001** — *Validated in Phase 1*
- [x] All six routes (`/`, `/welcome`, `/permissions`, `/select-provider`, `/connecting`, `/success`) reachable as placeholders wrapped in `FlowLayout` with `FetchLogo` visible — *Validated in Phase 1*

### Active

- [ ] Splash screen at `/` auto-redirects to `/welcome` after ~2.5s with logo scale-in + breathing animation
- [ ] Welcome screen at `/welcome` explains the Plantegrity ↔ payroll connection and routes to `/permissions`
- [ ] Permissions screen at `/permissions` displays a 2×3 grid of the six permission scopes (Organization, Team, Employment, Payroll, Pay Statement, SSN) and routes to `/select-provider`
- [ ] Select-provider screen at `/select-provider` offers an MUI Select with 4 providers (Gusto, ADP, Paycom, Rippling), shows a "Connecting…" loading state on submit, and routes to `/connecting?provider={slug}`
- [ ] Connecting screen at `/connecting` shows a spinner and provider-name copy, auto-advancing to `/success` after ~2.5s (reads `?provider=`, redirects to `/select-provider` if missing/invalid)
- [ ] Success screen at `/success` displays a Fetch-branded confirmation panel with a green checkmark, "Connected successfully" heading, and a "Done" button back to `/`

## Current State

Phase 1 (Foundation & Shared Chrome) complete — walking-skeleton end state. All six routes reachable with Fetch-branded chrome, MUI theme, Inter font, and shared components in place. Phase 2 (Pre-Provider Flow) is next.

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
- Brand tokens (hex values) are pinned in the spec; the MUI theme should reflect them so screens can use theme keys rather than hardcoding colors (except provider brand colors like Gusto coral).
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
*Last updated: 2026-05-18 after Phase 1 completion*
