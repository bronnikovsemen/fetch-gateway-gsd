---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: executing
last_updated: "2026-05-18T16:30:00Z"
progress:
  total_phases: 4
  completed_phases: 1
  total_plans: 7
  completed_plans: 7
  percent: 100
---

# State: Fetch Gateway (MUI Rebuild)

**Initialized:** 2026-05-18
**Last updated:** 2026-05-18 after completing Plan 02-04 (`/permissions` real screen — FLOW-03 closed; Phase 2 complete)

## Project Reference

- **What:** Fetch Gateway — OAuth onboarding microsite rebuild on MUI (Next.js 15 App Router)
- **Core value:** A polished, on-brand five-step demo flow from splash → success, fully mocked, production-quality at 1440px desktop
- **Mode:** MVP (each phase ships a navigable vertical slice)
- **Granularity:** coarse (4 phases)
- **Current focus:** Phase 02 — pre-provider-flow

## Current Position

Phase: 02 (pre-provider-flow) — COMPLETE
Plan: 4 of 4 done (Plans 02-01, 02-02, 02-03, 02-04 all complete; Phase 2 fully delivered)

- **Milestone:** v1 release
- **Phase:** 2 → ready to transition to Phase 3
- **Plan:** 02-04 complete; Phase 2 is closed; next up is `/gsd-transition` (or Phase 3 planning)
- **Status:** Phase 02 complete — pre-provider flow `/` → `/welcome` → `/permissions` → `/select-provider` is navigable end-to-end with no placeholder content on Phase 2 routes
- **Progress:** [██████████] 100% (Phase 2 plans); 50% milestone (2/4 phases done)

## Performance Metrics

| Metric | Value |
|--------|-------|
| Phases planned | 4 |
| Phases complete | 2 |
| Plans complete | 7 |
| v1 requirements | 22 |
| Requirements mapped | 22 |
| Requirements validated | 14 (FOUND-01..07, UI-01..03, QUAL-04, FLOW-01, FLOW-02, FLOW-03) |
| Phase 1 REVIEW warnings closed | 2 (WR-01, WR-02 via Plan 02-01; SPLIT-shape consumer live in Plan 02-04) |

### Plan Execution Log

| Phase-Plan | Duration | Tasks | Files | Commits |
|------------|----------|-------|-------|---------|
| 01-01      | 387s (6m 27s) | 3 | 11 | 3 |
| 01-02      | 143s (2m 23s) | 2 | 4  | 2 |
| 01-03      | 273s (4m 33s) | 2 | 6  | 1 |
| 02-01      | 65s (1m 5s)   | 1 | 1  | 1 |
| 02-02      | 124s (2m 4s)  | 1 | 1  | 1 |
| 02-03      | ~ (sequential) | 1 | 1  | 1 |
| 02-04      | 114s (1m 54s) | 1 | 1  | 1 |

## Accumulated Context

### Decisions (carried from PROJECT.md)

- MUI is the exclusive UI library — no Tailwind, shadcn, lucide-react, or CVA
- `/provider-sign-in`, `/provider-authorize`, and `/dashboard` are out of scope; success is a simpler Fetch-branded `/success`
- Inter loaded via `next/font/google` as `--font-inter`
- Dev server on port 3001
- Provider catalog centralized in `src/lib/providers.ts` (single source of truth)
- `AppRouterCacheProvider` from `@mui/material-nextjs/v15-appRouter` is required to prevent SSR flicker

### Decisions (Plan 01-01)

- **MUI v9 provider tree lives behind a client `ThemeRegistry` wrapper** (`src/theme/ThemeRegistry.tsx`). MUI v9's `ThemeProvider` is a Client Component and the theme object contains non-serializable functions, so passing `theme={theme}` directly from a Server Component layout throws. The wrapper preserves the plan's must-haves (SSR-themed markup, providers in order, root layout still a Server Component).
- **Package manager is npm, not pnpm.** `pnpm` is not on the executor's PATH. The lockfile is `package-lock.json`. Downstream plans should use npm.
- **Next.js pinned to 15.5.18** (latest patched 15.x) to clear CVE-2025-66478 at scaffold time.
- **`shape.borderRadius: 12` centralized in the theme** to feed UI-01's panel-radius requirement from a single source.

### Decisions (Plan 01-02)

- **`Provider` type uses a string-literal slug union** (`'gusto' | 'adp' | 'paycom' | 'rippling'`) — not a generic `string`. With `as const satisfies readonly Provider[]` on the array, call sites see literal slug types, so Phase 3's `/connecting` query-param guard can narrow without a runtime cast.
- **`FetchLogo` is an inline SVG placeholder** (rounded blue square + white "F"). The JSDoc directly above the component flags it as intended-to-be-swapped for real artwork. The public API (`size`, `color`, `title`) and named export are guaranteed stable across the future swap.
- **`FlowLayout` consumes MUI theme tokens** (`bgcolor: 'background.default'` for the page, `backgroundColor: 'background.paper'` for the Paper) rather than hardcoding hex. The only hardcoded literals are the brand-spec contract values (`'12px'` borderRadius, `'0 2px 8px rgba(0,0,0,0.08)'` shadow).
- **`PermissionItem` applies `alignItems` via `sx`** (workaround for MUI v9.0.1 `Stack` typing regression — neither Stack overload exposes `alignItems` as a direct prop). Runtime behavior is identical to the top-level-prop form.

### Decisions (Plan 01-03)

- **All six route stubs share one Server-Component template** (FlowLayout + Stack + FetchLogo + h5 heading + body2 muted hint). Uniform shape makes the Walking Skeleton readable at a glance and keeps each stub atomic — Phase 2-4 can replace them one at a time without cross-stub coupling.
- **Two stubs carry one extra render each as in-situ smoke tests.** `/permissions` mounts one `<PermissionItem>` (UI-03 smoke test); `/select-provider` maps the four provider names (FOUND-07 smoke test). The convention is that these are proofs the imports work, not previews of the real screens.
- **Stack `alignItems` workaround was applied uniformly across the route layer.** Same Rule 1 fix already canonicalized by Plan 01-02 in PermissionItem — `alignItems` moves into `sx`. Now the codebase-wide convention.
- **Per-route `maxWidth` is supplied at the call site** (440/440/768/498/440/440) rather than configured in FlowLayout. The spec's per-screen sizing belongs to the route, not the shared chrome.

### Decisions (Plan 02-01)

- **FlowLayout's padding API is `px?: number` + `py?: number` (theme-spacing units), defaults 6/6 = 48px uniform.** Replaces the broken `padding: number` scalar (which interpolated to raw px and bypassed MUI theme spacing). Closes Phase 1 REVIEW WR-01 (px-string interpolation) and WR-02 (single scalar can't express /permissions' 36/48 split).
- **Dropped the old `padding` prop outright rather than keeping it for back-compat.** Phase 1 REVIEW confirmed no caller passed it (six route stubs all relied on the default). Defaults preserve Phase 1's exact visual baseline; Wave-2 plans can now express `/welcome` (48/48 uniform) and `/permissions` (36/48 split) via the new API without sx overrides.

### Decisions (Plan 02-02)

- **The `/` splash sits on a bare flex `Box`, NOT inside `FlowLayout`.** Spec's `### / — Splash` section is explicit: splash has no white panel chrome. Every other Fetch-branded route uses FlowLayout. Phase 1's stub used FlowLayout only as a smoke convenience; the real screen drops it.
- **Emotion `keyframes` declared at module scope, not in-component.** Prevents React from re-creating the keyframes object on each render. Pattern reused for Phase 3's `/connecting` spinner-side animations (if any).
- **Canonical Client Component pattern: `'use client'` + `useRouter` + `useEffect` with `setTimeout` + return `clearTimeout` cleanup.** This is the shape Phase 3's `/connecting` auto-advance will mirror — `useEffect` dependency array includes `router` to satisfy React lint; the cleanup is the T-02-02-01 mitigation (no stale push on unmount).
- **Comment block in `src/app/page.tsx` deliberately avoids the literals `#EBF5FF` and `FlowLayout`.** Acceptance-criteria greps are literal — they don't distinguish code from prose comments. Architectural rationale lives in the SUMMARY instead.

### Decisions (Plan 02-03)

- **Used `onClick` + `router.push` for the Get Started CTA, NOT `<Link>` from `next/link`.** Matches the splash auto-redirect's imperative-navigation style (Plan 02-02). Keeps a single navigation pattern across the flow — `/permissions` (Plan 02-04), `/select-provider`, `/connecting`, `/success` will all use the same imperative `onClick` → `router.push` pattern for primary CTAs. No two competing patterns.
- **MUI Button needs `textTransform: 'none'` to honor sentence-case spec labels.** MUI's default Button typography uppercases labels (`GET STARTED`). The spec uses sentence case (`Get Started`, `Continue`, `Back`, `Connect`, `Done`). Every brand Button in this codebase will set `sx={{ textTransform: 'none' }}` — canonicalized here at the first real Button consumer.
- **First real consumer of Plan 02-01's `px`/`py` API.** `/welcome` passes `px={6} py={6}` explicitly (= 48px uniform). Plan 02-04 (`/permissions`) will be the second consumer with the split shape `px={4.5} py={6}` (= 36px horizontal / 48px vertical). All other route stubs still use the API by defaulting.
- **`alignSelf: 'stretch'` on the Button.** The inner Stack has `alignItems: 'center'`, which would otherwise shrink the Button to fit its content. Stretching the Button to the Stack's full inner width makes the CTA the strongest visual anchor in the panel — matches the spec's `### /welcome — Welcome` screenshot.

### Decisions (Plan 02-04)

- **Column-major 2-column grid via CSS Grid (`gridAutoFlow: 'column'` + `repeat(3, auto)`) — not flexbox or two-Stack split.** Source code iterates the PERMISSIONS array in natural spec order (Org → Team → Employment → Payroll → Pay Statement → SSN); the CSS engine handles the visual column-major fill (left col items 1-3, right col items 4-6). Decouples source order from visual layout — adding a 7th scope later only requires bumping `repeat(3, auto)` to `repeat(4, auto)`, not rewriting source order or splitting the array manually.
- **`PERMISSIONS` is module-scope with `as const satisfies readonly { label: string; description: string }[]`.** Mirrors the Phase 1 `src/lib/providers.ts` pattern. Module scope avoids recreating the array on every render; `satisfies` gives the compiler the type contract without widening literal types. `key={perm.label}` is safe because every label is unique.
- **First SPLIT-shape consumer of Plan 02-01's `px`/`py` API.** `<FlowLayout maxWidth={768} px={4.5} py={6}>` = 36px horizontal / 48px vertical. First codebase caller to use a non-integer theme-spacing value. MUI's `theme.spacing(N)` accepts fractional N cleanly. This is the EXACT shape that motivated Phase 1 REVIEW WR-02 — the SPLIT consumer now exists and works without `sx` overrides.
- **Outer Stack uses `alignItems: 'stretch'`, not `'center'`.** Stretch is required so the grid child fills the panel's inner width inside the 768px panel. Center alignment would collapse the grid to its content width. This is the first codebase Stack that needs stretch rather than center because the grid is the first non-text-block content inside FlowLayout.
- **Both buttons use imperative `router.push` (Plan 02-03 pattern), right-aligned via `justifyContent: 'flex-end'`.** Back → `/welcome`, Continue → `/select-provider`. `minWidth: 120` on Back / `minWidth: 160` on Continue keeps the touchable footprint without forcing the buttons to span the row. `textTransform: 'none'` canonicalized by Plan 02-03 is preserved.

### Roadmap Decisions

- Coarse 4-phase shape matches the spec's natural implementation order and ships a navigable demo at every phase boundary
- Phase 1 ships routable stubs under the real `FlowLayout` chrome — every subsequent phase swaps stubs for full screens
- QUAL-04 (dependency exclusion) is enforced at scaffolding (Phase 1); QUAL-01..03 (TypeScript, console, dead buttons) are verified codebase-wide in Phase 4
- All four phases carry a `UI hint: yes` annotation — this project is entirely UI

### Todos

- (None — handed off to `/gsd:plan-phase 1`)

### Blockers

- (None)

### Open Questions

- (None — spec is comprehensive)

## Session Continuity

### Last Action

Completed Plan 02-04: rewrote `src/app/permissions/page.tsx` from the Phase 1 stub (one-off smoke-test single `PermissionItem` with trailing-period description) into the real `/permissions` disclosure screen — a Client Component (`'use client'`) wrapped in `<FlowLayout maxWidth={768} px={4.5} py={6}>` (768px white panel with 36px horizontal / 48px vertical SPLIT padding via Plan 02-01's `px`/`py` API — SECOND real consumer of that API and FIRST to use the asymmetric SPLIT shape, retiring Phase 1 REVIEW WR-02's motivation). Interior is an outer `<Stack spacing={4} sx={{ alignItems: 'stretch' }}>` (stretch, not center, so the grid child fills the panel) containing: a nested centered header `<Stack spacing={3} sx={{ alignItems: 'center' }}>` with `<FetchLogo size={100} />` and an `<Typography variant="h5" component="h1">` heading "To connect your payroll, Fetch will need access to:"; a 2-column CSS Grid `<Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'repeat(3, auto)', gridAutoFlow: 'column', columnGap: 4, rowGap: 3 }}>` mapping a module-scope `PERMISSIONS` array (typed `as const satisfies readonly { label: string; description: string }[]`, six entries in spec order: Organization, Team, Employment, Payroll, Pay Statement, SSN) into six `<PermissionItem>` renders — `gridAutoFlow: 'column'` produces the spec's column-major fill (left col items 1-3, right col items 4-6); and a right-aligned button-row `<Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end', mt: 2 }}>` with Back (`variant="outlined"`, `minWidth: 120`, `onClick={() => router.push('/welcome')}`) and Continue (`variant="contained"`, `minWidth: 160`, `onClick={() => router.push('/select-provider')}`) buttons, both with `textTransform: 'none'` and `fontWeight: 600`. All 35+ acceptance-criteria grep gates pass; `tsc --noEmit` exits 0; live HTTP smoke against `npm run dev` on port 3001 returns 200 with the heading, all six labels, all six descriptions, and both button labels present in SSR markup (7 `<svg>` tags: 1 FetchLogo + 6 CheckCircleIcons confirming six PermissionItem runtime renders). FLOW-03 closed. ROADMAP Phase 2 Success Criteria 3 and 4 satisfied end-to-end. Phase 2 (pre-provider flow) is now complete — all four plans done.

### Next Action

Phase 2 is complete. Run `/gsd-transition` to close Phase 2 and move to Phase 3 (Provider Selection & Connecting Bridge — `/select-provider` MUI Select with loading-state submit, and `/connecting` spinner with query-param guard and auto-advance; covers FLOW-04..07). The Continue button on `/permissions` already lands on the Phase 1 `/select-provider` stub today; Phase 3 will replace that stub with the real screen.

### Recent Files Touched

- `src/app/permissions/page.tsx` (Plan 02-04 Task 1 — full rewrite into the real permissions Client Component with FetchLogo + heading + 2x3 PermissionItem grid + Back/Continue navigation)
- `.planning/phases/02-pre-provider-flow/02-04-SUMMARY.md` (Plan 02-04 output)
- `src/app/welcome/page.tsx` (Plan 02-03 Task 1 — full rewrite into the real welcome Client Component with FetchLogo + heading + body copy + Get Started → /permissions)
- `.planning/phases/02-pre-provider-flow/02-03-SUMMARY.md` (Plan 02-03 output)
- `src/app/page.tsx` (Plan 02-02 Task 1 — full rewrite into the real splash Client Component with scale-in + breathing keyframes and auto-redirect to /welcome at 2500ms)
- `.planning/phases/02-pre-provider-flow/02-02-SUMMARY.md` (Plan 02-02 output)
- `src/components/FlowLayout.tsx` (Plan 02-01 Task 1 — padding API widened to `px` + `py` theme-spacing units)
- `.planning/phases/02-pre-provider-flow/02-01-SUMMARY.md` (Plan 02-01 output)

---
*State managed by GSD workflow — updated at phase/plan transitions.*
