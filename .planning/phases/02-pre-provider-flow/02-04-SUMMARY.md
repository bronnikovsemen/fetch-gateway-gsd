---
phase: 02-pre-provider-flow
plan: 04
subsystem: permissions-screen
tags: [mvp, vertical-slice, permissions, grid, mui-button, client-component, flow-layout-consumer, flow-03]
dependency_graph:
  requires:
    - "Plan 02-01: FlowLayout `px`/`py` theme-spacing API (this plan is its second real consumer — first SPLIT-shape caller)"
    - "Plan 01-02: FetchLogo (100px default), PermissionItem ({label, description}), and FlowLayout chrome (white Paper on #EBF5FF)"
    - "Plan 02-03: canonical imperative `useRouter().push` Client Component pattern (mirrored here for Back + Continue)"
  provides:
    - "src/app/permissions/page.tsx — real `/permissions` screen with FetchLogo + heading + 2x3 PermissionItem grid (column-major) + Back (outlined → /welcome) + Continue (primary → /select-provider)"
    - "Phase 2 Success Criterion 3 + 4 — both satisfied end-to-end (768px panel, 2-column grid in spec order, Back/Continue real navigations)"
  affects:
    - "Phase 3 Plan for /select-provider — landing target of the Continue button; the imperative `router.push('/select-provider')` is the live edge into Phase 3"
    - "Phase 2 closure — last remaining plan of Phase 02; FLOW-03 is the final FLOW requirement for this phase"
tech_stack:
  added: []
  patterns:
    - "Column-major 2-column grid via CSS Grid: `display: 'grid'`, `gridTemplateColumns: '1fr 1fr'`, `gridTemplateRows: 'repeat(3, auto)'`, `gridAutoFlow: 'column'`. The combination of 3 explicit rows + column auto-flow lets source code iterate the array in natural spec order (Org, Team, Employment, Payroll, Pay Statement, SSN) while the visual layout column-fills left = items 1-3, right = items 4-6 per spec."
    - "Asymmetric (SPLIT) FlowLayout padding: `<FlowLayout maxWidth={768} px={4.5} py={6}>` — 4.5 × 8px = 36px horizontal, 6 × 8px = 48px vertical. First codebase caller to use a non-integer theme-spacing value and the first SPLIT-shape consumer of Plan 02-01's API. MUI's theme.spacing(N) accepts fractional N, so `px={4.5}` resolves cleanly to `theme.spacing(4.5) = '36px'`."
    - "Outer Stack uses `alignItems: 'stretch'` (not `'center'`) so the grid child fills the panel width. Center alignment would collapse the grid to its content width, which would not produce the spec's 2-column layout inside the 768px panel."
    - "Button row at the bottom uses `direction='row'` + `justifyContent: 'flex-end'` so Back and Continue sit right-aligned with a 16px (`spacing={2}`) gap between them — matches the spec's `### /permissions — Permissions` shot."
    - "Imperative navigation for BOTH buttons (`<Button onClick={() => router.push('...')}>`) keeps the codebase on one navigation pattern across the flow. Same shape as Plan 02-03's Get Started CTA and Plan 02-02's splash auto-redirect."
key_files:
  created: []
  modified:
    - "src/app/permissions/page.tsx"
decisions:
  - "Used `gridAutoFlow: 'column'` plus explicit `gridTemplateRows: 'repeat(3, auto)'` (rather than a flexbox with manual column splits or two separate Stacks) so the source PERMISSIONS array can stay in natural spec order and the CSS engine handles the column-major fill. This keeps the readable source (Org → Team → Employment → Payroll → Pay Statement → SSN) and the spec's visual layout (left col: Org/Team/Employment; right col: Payroll/Pay Statement/SSN) decoupled — adding a 7th scope later (if ever) only requires bumping `repeat(3, auto)` to `repeat(4, auto)`, not rewriting the source order."
  - "Declared `PERMISSIONS` at module scope (not inside `Page`) with `as const satisfies readonly { label: string; description: string }[]` — mirrors the Phase 1 `src/lib/providers.ts` pattern. Module scope avoids recreating the array on every render; the `satisfies` clause gives the compiler the type contract without widening the literal types of the entries. PermissionItem's `key={perm.label}` is safe because every label is unique."
  - "Second consumer of Plan 02-01's `px`/`py` API and the FIRST to exercise the SPLIT shape (`px={4.5} py={6}` = 36px / 48px). This is the exact motivation Phase 1 REVIEW WR-02 raised: a single `padding: number` scalar could not express this shape. The SPLIT consumer now exists and works without any `sx` overrides at the call site, fully retiring the WR-02 concern."
  - "Both buttons use `textTransform: 'none'` to honor sentence-case spec labels (`Back`, `Continue`) — same convention canonicalized by Plan 02-03 at the first MUI Button consumer. `minWidth: 120` on Back / `minWidth: 160` on Continue gives both buttons a touchable footprint without forcing them to span the row."
  - "Inline comment above the grid Box explicitly explains the column-fill mechanism (`gridAutoFlow: 'column'`) so a future reader doesn't need to mentally simulate the source-vs-visual mapping. The comment is on a dedicated line just above the Box opening tag to stay readable in code review diffs."
metrics:
  duration_seconds: 114
  duration_human: "1m 54s"
  completed: "2026-05-18T16:22:31Z"
  tasks_total: 1
  tasks_completed: 1
  files_created: 0
  files_modified: 1
  commits: 1
---

# Phase 2 Plan 04: `/permissions` real screen — Summary

**One-liner:** Replaced the Phase 1 `/permissions` placeholder (one-off smoke-test single `PermissionItem`) with the real disclosure screen — a 768px centered white panel on `#EBF5FF` with 36/48 SPLIT padding via FlowLayout's new `px={4.5} py={6}` API (Plan 02-01), the Fetch logo, the spec heading "To connect your payroll, Fetch will need access to:", a 2-column CSS-grid layout of all six permission scopes in column-major spec order (left = Organization / Team / Employment; right = Payroll / Pay Statement / SSN), and a right-aligned Back (outlined → `/welcome`) + Continue (primary contained → `/select-provider`) button row. Closes FLOW-03. Second consumer of FlowLayout's `px`/`py` API; **first SPLIT-shape consumer**, retiring the WR-02 motivation.

## What landed

- **`src/app/permissions/page.tsx` is now a Client Component.** First line `'use client'`. The component reads `const router = useRouter()` from `next/navigation` and renders the full real disclosure screen. The Phase 1 stub strings (`Permissions (\`/permissions\`)`, `Phase 1 placeholder — real permissions grid lands in Phase 2 (FLOW-03).`) and the one-off smoke-test `<PermissionItem label="Organization" description="Business profile, contact details, and banking information." />` (the version with a trailing period) are fully gone.
- **Panel chrome via FlowLayout with the SPLIT padding shape.** `<FlowLayout maxWidth={768} px={4.5} py={6}>` — the spec's 768px-wide panel with 36px horizontal padding (4.5 × 8 = 36) and 48px vertical padding (6 × 8 = 48). This is the SECOND caller in the codebase to exercise Plan 02-01's `px`/`py` API and the FIRST to use the asymmetric SPLIT shape — exactly the motivation that closed Phase 1 REVIEW WR-02.
- **Module-scope `PERMISSIONS` array, six entries in spec order.** Typed `as const satisfies readonly { label: string; description: string }[]` (the same pattern Phase 1 used in `src/lib/providers.ts`). Entries 1-6: Organization, Team, Employment, Payroll, Pay Statement, SSN. All six descriptions match the spec verbatim with NO trailing periods (the smoke-test variant's trailing period is dropped).
- **Centered header Stack.** Inside the outer Stack, a nested `<Stack spacing={3} sx={{ alignItems: 'center' }}>` holds the `<FetchLogo size={100} />` and the `<Typography variant="h5" component="h1" sx={{ fontWeight: 700, color: 'text.primary', textAlign: 'center' }}>` heading "To connect your payroll, Fetch will need access to:" (note: comma after "payroll", trailing colon — matches spec exactly).
- **2-column CSS Grid for the six PermissionItems.** A `Box` with `sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'repeat(3, auto)', gridAutoFlow: 'column', columnGap: 4, rowGap: 3 }}` — the `gridAutoFlow: 'column'` + three explicit rows is what produces the spec's column-major fill while letting the source iterate the array in natural order. Inside the Box, `PERMISSIONS.map((perm) => <PermissionItem key={perm.label} label={perm.label} description={perm.description} />)`. A one-line inline comment above the Box explains the column-fill mechanism.
- **Right-aligned Back + Continue button row.** `<Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end', mt: 2 }}>` with two buttons: Back is `<Button variant="outlined" color="primary" size="large" onClick={() => router.push('/welcome')} sx={{ textTransform: 'none', fontWeight: 600, minWidth: 120 }}>Back</Button>`. Continue is `<Button variant="contained" color="primary" size="large" onClick={() => router.push('/select-provider')} sx={{ textTransform: 'none', fontWeight: 600, minWidth: 160 }}>Continue</Button>`. Both buttons use the same imperative `useRouter().push` pattern that Plan 02-03 canonicalized — no `<Link>` from `next/link`.
- **Outer Stack uses `alignItems: 'stretch'`.** Not `'center'` — stretch is required so the grid child fills the panel's inner width inside the 768px panel. Centering would collapse the grid to its content width.
- **No hex literals leak into screen code.** All colors come from the MUI theme: `text.primary`, `text.secondary` (in PermissionItem), and `color="primary"` on the Buttons (resolves through `theme.palette.primary.main = '#2463EC'`). The page background `#EBF5FF` comes from FlowLayout's `bgcolor: 'background.default'`.
- **Strict hygiene:** no `console.log`, no `: any`, no new dependencies. The imports list is exactly the eight the Plan prescribes (`useRouter`, `Box`, `Stack`, `Typography`, `Button`, `FlowLayout`, `FetchLogo`, `PermissionItem`).

## Tasks executed

| Task | Name                                                                                                  | Commit    | Files                              |
| ---- | ----------------------------------------------------------------------------------------------------- | --------- | ---------------------------------- |
| 1    | Rewrite /permissions as the real disclosure screen with 2x3 permission grid and Back/Continue navigation | `b87b0b2` | `src/app/permissions/page.tsx`     |

## Verification evidence

`npx tsc --noEmit` → exit `0` (clean compile across the whole project).

All 35+ acceptance-criteria grep gates from `<acceptance_criteria>` passed:

- `head -3 src/app/permissions/page.tsx | grep -c "'use client'"` → `1` ✅
- `grep -cF "To connect your payroll, Fetch will need access to:" src/app/permissions/page.tsx` → `1` ✅
- `grep -cF "'Organization'" src/app/permissions/page.tsx` → `1` ✅
- `grep -cF "'Team'" src/app/permissions/page.tsx` → `1` ✅
- `grep -cF "'Employment'" src/app/permissions/page.tsx` → `1` ✅
- `grep -cF "'Payroll'" src/app/permissions/page.tsx` → `1` ✅
- `grep -cF "'Pay Statement'" src/app/permissions/page.tsx` → `1` ✅
- `grep -cF "'SSN'" src/app/permissions/page.tsx` → `1` ✅
- `grep -cF "Business profile, contact details, and banking information" src/app/permissions/page.tsx` → `1` ✅
- `grep -cF "Roster of people and reporting structure" src/app/permissions/page.tsx` → `1` ✅
- `grep -cF "Employment status, contact details, role, and compensation" src/app/permissions/page.tsx` → `1` ✅
- `grep -cF "Payments made to employees and contractors" src/app/permissions/page.tsx` → `1` ✅
- `grep -cF "Itemized pay statements per employee" src/app/permissions/page.tsx` → `1` ✅
- `grep -cF "Social Security Numbers for tax reporting" src/app/permissions/page.tsx` → `1` ✅
- `grep -cF "Business profile, contact details, and banking information." src/app/permissions/page.tsx` → `0` ✅ (no trailing period — smoke-test artefact removed)
- `grep -cE "router\.push\(['\"]\/welcome['\"]\)" src/app/permissions/page.tsx` → `1` ✅
- `grep -cE "router\.push\(['\"]\/select-provider['\"]\)" src/app/permissions/page.tsx` → `1` ✅
- `grep -cF '>Back<' src/app/permissions/page.tsx` → `1` ✅
- `grep -cF '>Continue<' src/app/permissions/page.tsx` → `1` ✅
- `grep -cE 'variant="outlined"' src/app/permissions/page.tsx` → `1` ✅
- `grep -cE 'variant="contained"' src/app/permissions/page.tsx` → `1` ✅
- `grep -cE '<FlowLayout[^>]*maxWidth=\{768\}' src/app/permissions/page.tsx` → `1` ✅
- `grep -cE 'px=\{4\.5\}' src/app/permissions/page.tsx` → `2` ✅ (≥1; 1 in JSDoc comment + 1 in JSX FlowLayout prop)
- `grep -cE 'py=\{6\}' src/app/permissions/page.tsx` → `2` ✅ (≥1; 1 in JSDoc comment + 1 in JSX FlowLayout prop)
- `grep -cE "gridAutoFlow: 'column'" src/app/permissions/page.tsx` → `2` ✅ (≥1; 1 in inline comment + 1 in sx)
- `grep -cE "gridTemplateRows: 'repeat\(3, auto\)'" src/app/permissions/page.tsx` → `1` ✅
- `grep -cE "gridTemplateColumns: '1fr 1fr'" src/app/permissions/page.tsx` → `1` ✅
- `grep -cE '<PermissionItem\b' src/app/permissions/page.tsx` → `1` ✅ (single instantiation inside `.map`; runtime produces six elements)
- `grep -cF '#2463EC' src/app/permissions/page.tsx` → `0` ✅ (no hex leaks)
- `grep -cF '#EBF5FF' src/app/permissions/page.tsx` → `0` ✅ (no hex leaks)
- `grep -cF 'Permissions (\`/permissions\`)' src/app/permissions/page.tsx` → `0` ✅ (Phase 1 placeholder string gone)
- `grep -cF 'Phase 1 placeholder' src/app/permissions/page.tsx` → `0` ✅ (Phase 1 placeholder string gone)
- `grep -cE 'console\.log' src/app/permissions/page.tsx` → `0` ✅ (hygiene)
- `grep -vE '^\s*//' src/app/permissions/page.tsx | grep -cE '(^|[^a-zA-Z_]): *any( |;|,|>|$)'` → `0` ✅ (no `: any`)

**Live HTTP smoke test** (with `npm run dev` running on port 3001):

- `curl -s -o /tmp/permissions.html -w "%{http_code}" http://localhost:3001/permissions` → `200` ✅
- `grep -cF "To connect your payroll, Fetch will need access to:" /tmp/permissions.html` → `1` ✅ (heading present in SSR markup)
- `grep -cF "Organization" /tmp/permissions.html` → `1` ✅
- `grep -cF "Team" /tmp/permissions.html` → `1` ✅
- `grep -cF "Employment" /tmp/permissions.html` → `1` ✅
- `grep -cF "Payroll" /tmp/permissions.html` → `1` ✅
- `grep -cF "Pay Statement" /tmp/permissions.html` → `1` ✅
- `grep -cF "SSN" /tmp/permissions.html` → `1` ✅
- `grep -cF "Back" /tmp/permissions.html` → `1` ✅ (button label present in SSR)
- `grep -cF "Continue" /tmp/permissions.html` → `1` ✅ (button label present in SSR)
- All six description strings appear in SSR markup verbatim
- `<svg ...>` count in SSR markup: `7` ✅ (1 FetchLogo + 6 PermissionItem CheckCircleIcon — confirms exactly six PermissionItem renders at runtime, matching the spec's 2x3 grid)

## Confirmation: Phase 1 placeholder strings and smoke-test PermissionItem are gone

All three Phase 1 stub artefacts are removed from `src/app/permissions/page.tsx`:

- `Permissions (\`/permissions\`)` → 0 matches ✅
- `Phase 1 placeholder — real permissions grid lands in Phase 2 (FLOW-03).` → 0 matches ✅
- `<PermissionItem label="Organization" description="Business profile, contact details, and banking information." />` (the one-off smoke-test, identifiable by the trailing period on its description) → 0 matches ✅. The replacement has SIX `PermissionItem` renders (via `.map`), and the description "Business profile, contact details, and banking information" appears without a trailing period.

## FLOW-03 satisfied

The requirement is now satisfied end-to-end:

> **FLOW-03:** `/permissions` displays a centered white panel (max-width 768px, 48px horizontal padding) with Fetch logo, heading "To connect your payroll, Fetch will need access to:", a 2-column grid of 6 `PermissionItem`s (Organization, Team, Employment / Payroll, Pay Statement, SSN), and "Back" (outlined → `/welcome`) and "Continue" (primary → `/select-provider`) buttons side by side

Mapped 1-for-1 to the implementation. Note: REQUIREMENTS.md describes "48px horizontal padding" but the spec's `### /permissions — Permissions` section and this plan's `<must_haves>` both specify the SPLIT shape — 36px horizontal, 48px vertical. The plan's `px={4.5} py={6}` resolves to exactly that split. The 768px max-width, 2-column grid, all six scopes, and both navigation buttons are satisfied verbatim.

| FLOW-03 element             | Implementation                                                                                          |
| --------------------------- | ------------------------------------------------------------------------------------------------------- |
| Centered white panel        | `<FlowLayout maxWidth={768} px={4.5} py={6}>` (Paper on `background.default` page bg)                   |
| 768px max-width             | `maxWidth={768}` on FlowLayout                                                                          |
| 36px horizontal padding     | `px={4.5}` (theme spacing 4.5 × 8 = 36)                                                                 |
| 48px vertical padding       | `py={6}` (theme spacing 6 × 8 = 48)                                                                     |
| Fetch logo                  | `<FetchLogo size={100} />`                                                                              |
| Heading                     | `<Typography variant="h5" component="h1">To connect your payroll, Fetch will need access to:</Typography>` |
| 2-column grid               | `<Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'repeat(3, auto)', gridAutoFlow: 'column', columnGap: 4, rowGap: 3 }}>` |
| Six PermissionItems         | `PERMISSIONS.map(...)` — six entries: Organization, Team, Employment, Payroll, Pay Statement, SSN       |
| Spec column-major fill      | `gridAutoFlow: 'column'` + `repeat(3, auto)` → left col items 1-3, right col items 4-6                  |
| Back outlined → /welcome    | `<Button variant="outlined" onClick={() => router.push('/welcome')}>Back</Button>`                      |
| Continue primary → /select  | `<Button variant="contained" onClick={() => router.push('/select-provider')}>Continue</Button>`         |

## Second consumer of FlowLayout's px/py API — first SPLIT-shape caller

Plan 02-01 widened FlowLayout's padding API from a broken `padding: number` scalar (which interpolated to raw px and bypassed MUI's theme.spacing) to a typed `px?: number` + `py?: number` pair. Plan 02-01's SUMMARY anticipated the two real consumer shapes:

> Defaults preserve Phase 1's exact visual baseline; Wave-2 plans can now express `/welcome` (48/48 uniform) and `/permissions` (36/48 split) via the new API without sx overrides.

Plan 02-03 delivered the first consumer with `px={6} py={6}` (= 48px uniform — `/welcome`). This plan delivers the second consumer AND the first SPLIT-shape caller with `px={4.5} py={6}` (= 36px horizontal / 48px vertical — `/permissions`). The SPLIT shape was the EXACT motivation behind Phase 1 REVIEW WR-02 — a single `padding: number` scalar could not express it. WR-02's premise is now fully retired: the SPLIT consumer exists and works without any `sx` overrides at the call site.

## ROADMAP Phase 2 Success Criteria 3 and 4 satisfied

> **Criterion 3:** `/permissions` shows a centered 768px-wide white panel with Fetch logo, heading "To connect your payroll, Fetch will need access to:", and a 2-column grid of six `PermissionItem`s (Organization, Team, Employment / Payroll, Pay Statement, SSN) with correct labels and descriptions

✅ Observable end-to-end in a browser. Live HTTP smoke confirmed all six labels + all six descriptions + the heading present in SSR markup; SVG count of 7 (1 FetchLogo + 6 CheckCircleIcons) confirms six PermissionItem renders.

> **Criterion 4:** On `/permissions`, the "Back" outlined button returns to `/welcome` and the "Continue" primary button advances to `/select-provider` — both are real navigations, no dead buttons

✅ Both buttons use `useRouter().push` with static literal targets. Back lands on the real `/welcome` screen (delivered in Plan 02-03), Continue lands on the Phase 1 `/select-provider` stub today and will land on the real `/select-provider` screen once Phase 3 ships it. Neither is a dead button — both are real navigations.

## Phase 2 closure

Plan 02-04 is the last remaining plan of Phase 2. With this commit:

- FLOW-01 (splash), FLOW-02 (welcome), FLOW-03 (permissions) are all closed.
- All four Phase 2 Success Criteria are satisfied end-to-end.
- Phase 1 REVIEW warnings WR-01 (padding raw-px interpolation) and WR-02 (single-scalar padding can't express SPLIT) are both fully retired — the SPLIT-shape consumer is now live and validated.
- The full pre-provider narrative `/` → `/welcome` → `/permissions` → `/select-provider` is navigable as a coherent on-brand intro with no placeholder content on any Phase 2 route.

Phase 3 can begin once Phase 2 is reviewed.

## Deviations from Plan

None — Plan 02-04 executed exactly as written. The single task ran end-to-end without auto-fixes, blockers, or architectural questions. The plan was sufficiently precise about identifiers, prop names, values, and string contents that the implementation produced a single self-consistent file on the first write. No Rule 1/2/3 deviations, no checkpoint surfaces, no auth gates.

Note on the JSON-config drift observed during git status before commit: `.planning/config.json` and `Main_Fetch_Gateway.md` showed as modified/untracked respectively, but neither is part of this task's `<files_modified>` scope. Per the executor's scope-boundary rule, only `src/app/permissions/page.tsx` was staged and committed. The config drift is a workflow-flag write outside this plan's responsibility.

## Authentication gates

None — Plan 02-04 has no network surface, no API keys, no auth interactions. Pure local screen rebuild + two client-side imperative navigations to static literal routes.

## Known Stubs

None new. The `FetchLogo` SVG placeholder noted in Plan 01-02's SUMMARY remains the only intentional, plan-sanctioned stub in the codebase and is unchanged here. Continue navigates to the Phase 1 `/select-provider` stub today; that stub is the next plan's responsibility (Phase 3), not a stub regression of this plan.

## Threat Flags

None. STRIDE register entries T-02-04-01 (Tampering of `router.push` targets — `accept` disposition) and T-02-04-02 (Information disclosure of permission scope copy — `accept` disposition, spec-mandated) are both satisfied as designed: both navigation targets (`/welcome`, `/select-provider`) are static string literals — no untrusted user input feeds either navigation. The disclosure copy is spec-mandated.

## Deferred Issues

None from this plan. The Phase 1 `postcss` advisory remains deferred to Phase 4 hardening.

## Self-Check: PASSED

Modified files (verified to exist):
- `src/app/permissions/page.tsx` — FOUND

Commits (verified in `git log`):
- `b87b0b2` feat(02-04): replace /permissions stub with real disclosure screen → /select-provider — FOUND
