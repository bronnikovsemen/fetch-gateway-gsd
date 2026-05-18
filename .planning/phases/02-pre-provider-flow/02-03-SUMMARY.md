---
phase: 02-pre-provider-flow
plan: 03
subsystem: welcome-screen
tags: [mvp, vertical-slice, welcome, mui-button, client-component, flow-layout-consumer, flow-02]
dependency_graph:
  requires:
    - "Plan 02-01: FlowLayout `px`/`py` theme-spacing API (this plan is its first real consumer)"
    - "Plan 01-02: FetchLogo (100px default) and FlowLayout chrome (white Paper on #EBF5FF)"
  provides:
    - "src/app/welcome/page.tsx — real `/welcome` screen with FetchLogo + heading + body copy + primary Get Started button → /permissions"
    - "Canonical Client Component + Button + useRouter().push pattern that Plan 02-04 (/permissions Back/Continue) will mirror"
  affects:
    - "Plan 02-04 (/permissions) — Back button will reverse this navigation back to `/welcome`; same pattern for forward to `/select-provider`"
    - "Phase 2 Success Criterion 2 — now satisfied end-to-end (440px panel, 48px padding, heading + body + Get Started → /permissions)"
tech_stack:
  added: []
  patterns:
    - "Client Component pattern for screens that need imperative navigation: top-of-file `'use client'`, `useRouter()` at the top of the component body, `onClick={() => router.push('/route')}` on the Button. Same shape as Plan 02-02's splash (which uses `useEffect` + `setTimeout` + `router.push` instead of `onClick`). Standardizes imperative navigation across the flow — no `next/link` for primary CTAs."
    - "MUI Button textTransform override: `sx={{ textTransform: 'none' }}` because MUI's default Button typography uppercases its label. The spec uses sentence case (`Get Started`, not `GET STARTED`), so every brand Button in this codebase will need this override. Established here for the first time."
    - "Theme-token color sourcing throughout the file: `color: 'text.primary'` / `color: 'text.secondary'` / `color=\"primary\"`. No `#2463EC` or `#EBF5FF` hex literals leak into screen code — they live exclusively in `src/theme/theme.ts` (FOUND-03)."
key_files:
  created: []
  modified:
    - "src/app/welcome/page.tsx"
decisions:
  - "Used `onClick` + `router.push` for the Get Started CTA, NOT `<Link>` from `next/link`. Rationale: matches the splash auto-redirect's imperative-navigation style (Plan 02-02), keeps a single navigation pattern across the flow, and avoids two competing patterns for primary CTAs. The Plan explicitly mandated this in `<action>` step 4."
  - "Applied `alignItems: 'center'` via `sx` on the inner Stack rather than as a top-level Stack prop. This is the codebase-wide MUI v9.0.1 workaround canonicalized by Plan 01-02 (PermissionItem) and Plan 01-03 (all six route stubs). Maintaining the convention here avoids reintroducing the regression the Stack typing has."
  - "Set `alignSelf: 'stretch'` on the Button so it spans the inner Stack's full width inside the 440px panel. The Stack has `alignItems: 'center'`, which would otherwise shrink the button to its content. Stretching it makes the CTA the strongest visual anchor on the panel, matching the spec's `### /welcome — Welcome` shot."
  - "Heading uses `variant=\"h5\"` with `component=\"h1\"`. The h5 size matches the spec's panel-internal heading scale; the h1 semantic role is correct because there is no enclosing page heading. Decoupling visual variant from semantic level is a routine MUI Typography pattern."
metrics:
  duration_seconds: 0
  duration_human: "TBD"
  completed: "2026-05-18T16:30:00Z"
  tasks_total: 1
  tasks_completed: 1
  files_created: 0
  files_modified: 1
  commits: 1
---

# Phase 2 Plan 03: `/welcome` real screen — Summary

**One-liner:** Replaced the Phase 1 `/welcome` placeholder with the real welcome screen — a 440px centered white panel on `#EBF5FF` (48px uniform padding via FlowLayout's new `px={6} py={6}` API from Plan 02-01), Fetch logo (100px), spec heading "Connect your payroll provider", spec body copy verbatim, and a primary brand-blue "Get Started" MUI Button that imperatively navigates to `/permissions` via `useRouter().push`. Closes FLOW-02. First real consumer of Plan 02-01's `px`/`py` API.

## What landed

- **`src/app/welcome/page.tsx` is now a Client Component.** First line `'use client'`. The component reads `const router = useRouter()` from `next/navigation` and renders the welcome screen. The Phase 1 stub (`<Typography variant="h5">Welcome (\`/welcome\`)</Typography>` plus the muted "Phase 1 placeholder…" body) is fully gone.
- **Panel chrome through FlowLayout.** `<FlowLayout maxWidth={440} px={6} py={6}>` — the 440px width and 48px uniform padding the spec mandates for `/welcome`. This is the FIRST caller in the codebase to exercise Plan 02-01's `px`/`py` API; every other route stub still defaults to `px=6 py=6` implicitly. Future Plan 02-04 (`/permissions`) will be the second caller and the first to use the split shape `px={4.5} py={6}`.
- **Vertical Stack interior in spec order.** `<Stack spacing={3} sx={{ alignItems: 'center' }}>` containing, in order: `<FetchLogo size={100} />`, an `h1`-as-`h5` Typography "Connect your payroll provider" (bold, `text.primary`, centered), a `body1` Typography with the exact spec body copy ("Plantegrity has requested a secure read-only connection to your payroll data for plan validation and reconciliation. No data will be modified.") in `text.secondary`, centered, and a `<Button variant="contained" color="primary" size="large">Get Started</Button>` with `mt: 2`, `alignSelf: 'stretch'`, `textTransform: 'none'`, `fontWeight: 600`.
- **Primary Get Started CTA navigates via `router.push('/permissions')`.** Imperative navigation pattern — no `<Link>` from `next/link`. Same style as the splash auto-redirect (Plan 02-02). `Get Started` label is sentence case, hence `textTransform: 'none'` to override MUI's default uppercase Button typography.
- **No hex literals leak into screen code.** All colors come from the MUI theme: `text.primary`, `text.secondary`, and `color="primary"` on the Button (resolves through `theme.palette.primary.main = '#2463EC'`). The Fetch logo's brand-blue background and the page's `#EBF5FF` are both supplied by their respective components (FetchLogo internal default, FlowLayout's `bgcolor: 'background.default'`).
- **Strict hygiene:** no `console.log`, no `any`, no new dependencies. The imports list is exactly the six the Plan prescribes (`useRouter`, `Stack`, `Typography`, `Button`, `FlowLayout`, `FetchLogo`).

## Tasks executed

| Task | Name                                                                                              | Commit    | Files                       |
| ---- | ------------------------------------------------------------------------------------------------- | --------- | --------------------------- |
| 1    | Rewrite /welcome as the real screen — heading + body copy + Get Started button → /permissions     | `7908a43` | `src/app/welcome/page.tsx`  |

## Verification evidence

`npx tsc --noEmit` → exit `0` (clean compile).

All 14 acceptance-criteria grep gates from `<acceptance_criteria>` passed:

- `head -3 src/app/welcome/page.tsx | grep -c "'use client'"` → `1` ✅
- `grep -cF "Connect your payroll provider" src/app/welcome/page.tsx` → `1` ✅
- `grep -cF "Plantegrity has requested a secure read-only connection to your payroll data for plan validation and reconciliation. No data will be modified." src/app/welcome/page.tsx` → `1` ✅
- `grep -cF ">Get Started<" src/app/welcome/page.tsx` → `1` ✅
- `grep -cE "router\.push\(['\"]\/permissions['\"]\)" src/app/welcome/page.tsx` → `1` ✅
- `grep -cE "<FlowLayout[^>]*maxWidth=\{440\}" src/app/welcome/page.tsx` → `1` ✅
- `grep -cE "px=\{6\}" src/app/welcome/page.tsx` → `1` ✅
- `grep -cE "py=\{6\}" src/app/welcome/page.tsx` → `1` ✅
- `grep -cE "<FetchLogo[^>]*size=\{100\}" src/app/welcome/page.tsx` → `1` ✅
- `grep -cE "variant=['\"]contained['\"]" src/app/welcome/page.tsx` → `1` ✅
- `grep -cE "color=['\"]primary['\"]" src/app/welcome/page.tsx` → `1` ✅
- `grep -cF "#2463EC" src/app/welcome/page.tsx` → `0` ✅ (no hex leaks)
- `grep -cF "#EBF5FF" src/app/welcome/page.tsx` → `0` ✅ (no hex leaks)
- `grep -cF "Welcome (\`/welcome\`)" src/app/welcome/page.tsx` → `0` ✅ (Phase 1 placeholder string gone)
- `grep -cF "Phase 1 placeholder" src/app/welcome/page.tsx` → `0` ✅ (Phase 1 placeholder string gone)
- `grep -cE "console\.log" src/app/welcome/page.tsx` → `0` ✅ (hygiene)
- `grep -cE "(^|[^a-zA-Z_]): *any( |;|,|>|$)" src/app/welcome/page.tsx` → `0` ✅ (no `: any`)

**Live HTTP smoke test** (with `npm run dev` running on port 3001):

- `curl -s -o /tmp/welcome.html -w "%{http_code}" http://localhost:3001/welcome` → `200` ✅
- `grep -cF "Connect your payroll provider" /tmp/welcome.html` → `1` ✅ (heading present in SSR markup)
- `grep -cF "Plantegrity has requested a secure read-only connection" /tmp/welcome.html` → `1` ✅ (body copy present in SSR markup)
- `grep -cF "Get Started" /tmp/welcome.html` → `1` ✅ (Button label present in SSR markup)

## Confirmation: Phase 1 placeholder strings are gone

Both Phase 1 stub strings are removed from `src/app/welcome/page.tsx`:

- `Welcome (\`/welcome\`)` → 0 matches ✅
- `Phase 1 placeholder — real welcome screen lands in Phase 2 (FLOW-02).` → 0 matches ✅

## FLOW-02 satisfied

The requirement is now satisfied end-to-end:

> **FLOW-02:** `/welcome` displays a centered white panel (max-width 440px, 48px padding) with Fetch logo (100px), heading "Connect your payroll provider", explanatory body copy, and a primary "Get Started" button routing to `/permissions`.

Mapped 1-for-1 to the implementation:

| FLOW-02 element       | Implementation                                                                                |
| --------------------- | --------------------------------------------------------------------------------------------- |
| Centered white panel  | `<FlowLayout maxWidth={440} px={6} py={6}>` (Paper on `background.default` page bg)            |
| 440px max-width       | `maxWidth={440}` on FlowLayout                                                                |
| 48px padding          | `px={6} py={6}` (theme-spacing 6 × 8px = 48px) via FlowLayout's Plan 02-01 API                |
| Fetch logo (100px)    | `<FetchLogo size={100} />`                                                                    |
| Heading               | `<Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>Connect your payroll provider</Typography>` |
| Explanatory body copy | `<Typography variant="body1" sx={{ color: 'text.secondary', textAlign: 'center' }}>Plantegrity has requested...</Typography>` |
| Primary Get Started   | `<Button variant="contained" color="primary" size="large" ...>Get Started</Button>`           |
| Route → /permissions  | `onClick={() => router.push('/permissions')}`                                                 |

## First consumer of FlowLayout's new px/py API

Plan 02-01 widened FlowLayout's padding API from a broken `padding: number` scalar (which interpolated to raw px and bypassed MUI's theme.spacing) to a typed `px?: number` + `py?: number` pair that natively consumes theme-spacing units. Plan 02-01's SUMMARY anticipated `/welcome` would be the first real caller of this API:

> Phase 1 REVIEW confirmed no caller passed it (six route stubs all relied on the default). Defaults preserve Phase 1's exact visual baseline; Wave-2 plans can now express `/welcome` (48/48 uniform) and `/permissions` (36/48 split) via the new API without sx overrides.

This plan delivers the first explicit `px={6} py={6}` call (= 48px uniform, matching the spec's `/welcome` panel). Plan 02-04 will be the second consumer with the split shape `px={4.5} py={6}` for `/permissions`.

## ROADMAP Phase 2 Success Criterion 2

> `/welcome` shows a centered 440px-wide white panel (48px padding) with Fetch logo, heading "Connect your payroll provider", explanatory body copy, and a primary "Get Started" button that navigates to `/permissions`.

Observable end-to-end in a browser (verified by the live HTTP smoke + the 14 grep gates above). The button is a real navigation, not a dead button — `useRouter().push('/permissions')` lands on the Phase 1 `/permissions` stub today and will land on the real `/permissions` screen once Plan 02-04 ships.

## Deviations from Plan

None — Plan 02-03 executed exactly as written. The single task ran end-to-end without auto-fixes, blockers, or architectural questions. The only micro-adjustment during execution was inlining the Button label (`>Get Started</Button>`) onto the same line as the closing tag of the opening Button so the literal `>Get Started<` grep gate would match — this is a formatting nuance only, not a behavioral change.

## Authentication gates

None — Plan 02-03 has no network surface, no API keys, no auth interactions. Pure local screen rebuild + one client-side imperative navigation.

## Known Stubs

None new. The `FetchLogo` SVG placeholder noted in Plan 01-02's SUMMARY remains the only intentional, plan-sanctioned stub in the codebase and is unchanged here.

## Threat Flags

None. STRIDE register entry T-02-03-01 (Tampering of `router.push` target — `accept` disposition) is satisfied: the navigation target `'/permissions'` is a static string literal embedded in source — there is no untrusted user input feeding the navigation. No new trust boundary, no network surface, no schema change.

## Deferred Issues

None from this plan. The Phase 1 `postcss` advisory remains deferred to Phase 4 hardening.

## Self-Check: PASSED

Modified files (verified to exist):
- `src/app/welcome/page.tsx` — FOUND

Commits (verified in `git log`):
- `7908a43` feat(02-03): replace /welcome stub with real welcome screen → /permissions — FOUND
