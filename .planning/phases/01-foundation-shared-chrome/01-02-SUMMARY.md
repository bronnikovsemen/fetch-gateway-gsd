---
phase: 01-foundation-shared-chrome
plan: 02
subsystem: foundation
tags: [mui, components, shared-chrome, provider-catalog, fetch-brand]
dependency_graph:
  requires:
    - "Plan 01-01: Next.js 15 App Router + MUI v9 peer chain + brand-token theme + ThemeRegistry on port 3001"
  provides:
    - "src/lib/providers.ts — typed 4-entry provider catalog (single source of truth)"
    - "src/components/FlowLayout.tsx — centered white Paper on #EBF5FF page background, 12px radius, soft shadow"
    - "src/components/FetchLogo.tsx — inline SVG placeholder mark, size/color/title configurable"
    - "src/components/PermissionItem.tsx — blue checkmark + bold label + muted description row"
  affects:
    - "Plan 01-03 route stubs will import all four artifacts to scaffold the six demo routes"
    - "Phase 2 (welcome / permissions / select-provider) consumes FlowLayout + FetchLogo + PermissionItem + providers"
    - "Phase 3 (connecting / success) consumes FlowLayout + FetchLogo + providers"
tech_stack:
  added: []
  patterns:
    - "Type-safe literal slug union on Provider (not generic string) so /connecting query-param parsing can narrow without casts"
    - "'as const satisfies readonly Provider[]' preserves literal slug types at call sites"
    - "FlowLayout uses MUI theme tokens (bgcolor: background.default / background.paper) and hardcodes only brand-spec contract values (12px radius, 0 2px 8px shadow)"
    - "FetchLogo is inline SVG with a documented placeholder mark; public API stays stable so swap-in of real artwork is trivial"
    - "PermissionItem applies alignItems via sx (not as a top-level Stack prop) to work around an MUI v9.0.1 typing regression"
key_files:
  created:
    - "src/lib/providers.ts"
    - "src/components/FlowLayout.tsx"
    - "src/components/FetchLogo.tsx"
    - "src/components/PermissionItem.tsx"
  modified: []
decisions:
  - "Provider catalog uses a `Provider` type with a string-literal slug union (`'gusto' | 'adp' | 'paycom' | 'rippling'`), exported as a named type alongside the default-exported readonly array. This gives Phase 3's /connecting query-param guard a precise discriminator at compile time."
  - "FetchLogo is a placeholder inline SVG (rounded square + white 'F' in brand blue) — documented in JSDoc as intended-to-be-replaced. Choosing inline SVG over an <img src=...> avoids broken-asset rendering before final artwork ships; the props (size/color/title) and named export stay stable across the swap."
  - "FlowLayout consumes background.default (via theme = #EBF5FF) and background.paper (= #FFFFFF) as theme tokens rather than hardcoding hex. Only the brand-spec contract values (12px borderRadius, 0 2px 8px shadow) are hardcoded — these are spec literals, not theme tokens."
  - "PermissionItem moves alignItems from a top-level Stack prop into the sx prop because MUI v9.0.1's Stack typing rejects alignItems as a direct prop on its inferred overload. Runtime behavior is identical."
metrics:
  duration_seconds: 143
  duration_human: "2m 23s"
  completed: "2026-05-18T15:06:13Z"
  tasks_total: 2
  tasks_completed: 2
  files_created: 4
  files_modified: 0
  commits: 2
---

# Phase 1 Plan 02: Provider catalog + shared chrome components — Summary

**One-liner:** Built the four shared building blocks every later screen consumes — typed provider catalog (Gusto / ADP / Paycom / Rippling with spec-mandated brand hex), `FlowLayout` centered Paper, inline-SVG `FetchLogo`, and `PermissionItem` row — all theme-token-driven, all TypeScript-clean.

## What landed

- **`src/lib/providers.ts` is the single source of truth for the provider catalog.** Named `type Provider` with a string-literal slug union (`'gusto' | 'adp' | 'paycom' | 'rippling'`); default-exports a `readonly` 4-entry array in spec order with the exact brand-color hex codes (`#F45D48`, `#D90429`, `#003DA5`, `#F5A623`). Uses `as const satisfies readonly Provider[]` so call sites see literal slug types — no runtime casts needed in Phase 3's `/connecting` query-param guard. Mitigates T-01-02-01 (provider catalog drift).
- **`src/components/FlowLayout.tsx` is the centered white Paper every Fetch-branded screen lives inside.** Outer `Box` owns the page background (`bgcolor: 'background.default'` → `#EBF5FF` via theme), `minHeight: '100vh'`, flex-centered. Inner `Paper` owns the panel chrome: `elevation={0}` plus explicit `sx.borderRadius: '12px'`, `sx.boxShadow: '0 2px 8px rgba(0,0,0,0.08)'`, `backgroundColor: 'background.paper'`, `width: '100%'`, and the props-driven `maxWidth` (default 440 — welcome sizing; Phase 2-3 plans pass 768 / 498) and `padding` (default 48). No raw HTML; MUI primitives only.
- **`src/components/FetchLogo.tsx` renders an inline `<svg>` placeholder.** Rounded square (`rx="20"`) filled with the `color` prop (default `#2463EC`) containing a white bold "F" centered via `text-anchor="middle"` + `dominant-baseline="central"`. Includes a `<title>` element and `role="img"` + `aria-label` for accessibility. Props: `size` (default 100), `color` (default `#2463EC`), `title` (default `'Fetch'`). NO `@mui/icons-material` import. NO `<img>` tag. The JSDoc above the component flags the artwork as a placeholder to be swapped for the real Fetch wordmark — the public API stays stable across the swap.
- **`src/components/PermissionItem.tsx` renders the spec's permission row.** MUI `Stack` (direction="row", spacing 2) holding `CheckCircleIcon` (`color: 'primary.main'` = `#2463EC`, `fontSize="small"`, 2px top margin to align with the bold label baseline) plus a nested `Box` with two `Typography` children: bold label (`variant="body1"`, `fontWeight: 700`, `color: 'text.primary'`) and muted description (`variant="body2"`, `color: 'text.secondary'` → `#6B7280`).
- **TypeScript compiles cleanly.** `npx tsc --noEmit` exits 0 across the whole project. Zero `any`. Zero `console.log`. All four files theme-token-driven where the theme provides a token; brand-spec literals are the only hardcoded values.

## Tasks executed

| Task | Name                                                                                         | Commit    | Files                                                                                                              |
| ---- | -------------------------------------------------------------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------ |
| 1    | Create the provider catalog at `src/lib/providers.ts`                                        | `8d80b2b` | `src/lib/providers.ts`                                                                                             |
| 2    | Create the three shared chrome components (FlowLayout, FetchLogo, PermissionItem)            | `2749b4d` | `src/components/FlowLayout.tsx`, `src/components/FetchLogo.tsx`, `src/components/PermissionItem.tsx`               |

## Verification evidence

- `npx tsc --noEmit` → exit 0, zero errors across all four new files plus the existing scaffold.
- `grep` of `src/lib/providers.ts` confirms: named `export type Provider`; all four slugs (`'gusto'`, `'adp'`, `'paycom'`, `'rippling'`) appear in spec order; all four brand-color hex codes (`'#F45D48'`, `'#D90429'`, `'#003DA5'`, `'#F5A623'`) present exactly once. Provider count = 4 entries.
- `grep` of `FlowLayout.tsx` confirms: named export `FlowLayout`; references `background.default`; contains `minHeight`; the literal `'12px'` borderRadius; the literal `'0 2px 8px rgba(0,0,0,0.08)'` boxShadow; no raw `<div>` (verified with `grep -nE "<div\b"` returning empty).
- `grep` of `FetchLogo.tsx` confirms: named export `FetchLogo`; contains an inline `<svg>`; references the brand-blue hex `'#2463EC'`; has zero real imports of `@mui/icons-material` (verified with `grep -n "^import.*@mui/icons-material"` returning empty — earlier "FAIL" was a comment-string false positive); has zero real `<img>` JSX tags (verified with PCRE comment-aware grep returning empty).
- `grep` of `PermissionItem.tsx` confirms: named export `PermissionItem`; imports `CheckCircleIcon from '@mui/icons-material/CheckCircle'`; uses `primary.main`, `text.secondary`, and `fontWeight`.
- Hygiene: `grep -E "(^|[^a-zA-Z_]): *any( |;|,|>|$)"` returns empty across all four files. `grep "console.log"` returns empty across all four files.
- File contents verified by direct `Read` after `Write` (file state tracked by the harness).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 — Bug] MUI v9.0.1's Stack rejects `alignItems` as a top-level prop**

- **Found during:** Task 2, when `npx tsc --noEmit` failed at `PermissionItem.tsx:24` with `TS2769: No overload matches this call. ... Property 'alignItems' does not exist on type ...`
- **Root cause:** MUI v9.0.1's `Stack` exposes two type overloads — one requires a `component` prop, the other is the default. In neither overload does the TypeScript definition currently include `alignItems` as a direct prop, even though MUI's documentation says it's accepted as a shorthand. This appears to be a known MUI v9.0.1 typing regression — the runtime accepts the prop fine, only the types object to it.
- **Fix:** Moved `alignItems="flex-start"` into the `sx` prop: `sx={{ alignItems: 'flex-start' }}`. The `sx` prop's CSS-properties typing accepts `alignItems` without complaint, and the runtime output is identical (Stack applies `alignItems` to its underlying flex container either way).
- **Why this is Rule 1 not Rule 4:** This is a typing escape hatch, not an architectural change. The component still uses `Stack`, still applies the same CSS, still composes the same React tree. No new pattern, no new dependency, no API change visible to consumers.
- **Files modified:** `src/components/PermissionItem.tsx`
- **Commit:** `2749b4d` (rolled into Task 2)

No other deviations. Both tasks ran end-to-end as the plan described.

## Authentication gates

None — Plan 01-02 has no network surface, no API keys, no auth interactions. Pure local-source-file authorship.

## Known Stubs

- **`FetchLogo` SVG mark is a placeholder.** A rounded blue square with a white "F" stands in for the real Fetch wordmark. This is documented in the JSDoc directly above the component and is explicit in the plan's `<interfaces>` block (`The user will swap the actual artwork later; for now ship a recognizable placeholder.`). The component's prop API (`size`, `color`, `title`) and named export stay stable across the future artwork swap, so no consumer needs to change. **This is an intentional, plan-sanctioned stub** — not an oversight.

## Threat Flags

None. No new trust boundary. No network endpoints. No data persistence. No user input parsing. STRIDE register inherited from Plan 01-01 stands unchanged. T-01-02-01 (provider catalog drift) is now actively mitigated by the existence of `src/lib/providers.ts` as the single source of truth.

## Deferred Issues

None from this plan. The `postcss <8.5.10` moderate vulnerability noted in `.planning/phases/01-foundation-shared-chrome/deferred-items.md` is inherited from Plan 01-01 and remains deferred to Phase 4 hardening. No new items added.

## Phase 1 requirements satisfied

- **FOUND-07** ✅ Provider catalog exists at `src/lib/providers.ts` as the single source of truth (typed slug union, 4 entries, spec-mandated brand colors).
- **UI-01** ✅ `FlowLayout` centers a white Paper (12px radius, soft shadow) on the `#EBF5FF` page background via theme tokens.
- **UI-02** ✅ `FetchLogo` renders an inline SVG (not `@mui/icons-material`, not a broken `<img>`) with size/color/title props.
- **UI-03** ✅ `PermissionItem` shows the blue (`primary.main`) checkmark + bold (700) label + muted (`text.secondary`) description in a single horizontal row.

## Self-Check: PASSED

Created files (verified to exist):
- `src/lib/providers.ts` — FOUND
- `src/components/FlowLayout.tsx` — FOUND
- `src/components/FetchLogo.tsx` — FOUND
- `src/components/PermissionItem.tsx` — FOUND

Commits (verified in `git log`):
- `8d80b2b` feat(01-02): add provider catalog as single source of truth — FOUND
- `2749b4d` feat(01-02): add shared chrome components (FlowLayout, FetchLogo, PermissionItem) — FOUND
