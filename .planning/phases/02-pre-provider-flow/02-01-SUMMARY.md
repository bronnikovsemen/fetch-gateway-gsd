---
phase: 02-pre-provider-flow
plan: 01
subsystem: shared-chrome
tags: [mui, flow-layout, api-fix, phase-1-review-followup]
dependency_graph:
  requires:
    - "Plan 01-02: FlowLayout component with centered white Paper + brand-spec 12px radius and soft shadow"
  provides:
    - "src/components/FlowLayout.tsx — `px?: number` + `py?: number` theme-spacing prop API (replaces the broken `padding: number` scalar)"
  affects:
    - "Plan 02-03 (/welcome) — can pass `px={6} py={6}` (= 48px uniform) without an sx override"
    - "Plan 02-04 (/permissions) — can pass `px={4.5} py={6}` (= 36px horizontal / 48px vertical) without an sx override"
    - "Plans 02-02, 02-03, 02-04 — all three Wave-2 screen plans can run fully in parallel (none touches FlowLayout)"
tech_stack:
  added: []
  patterns:
    - "FlowLayout consumes MUI native theme-spacing units for padding (`px`, `py` props → resolved by MUI through `theme.spacing(N)` = N * 8px), replacing the previous raw-px string interpolation (`p: `${padding}px``) flagged by Phase 1 REVIEW WR-01."
    - "Split horizontal/vertical padding API matches the spec's two distinct consumer shapes — /welcome wants 48px uniform, /permissions wants 36/48 split — without forcing call sites to override at the sx level."
key_files:
  created: []
  modified:
    - "src/components/FlowLayout.tsx"
decisions:
  - "Dropped the `padding?: number` prop outright rather than keeping it for back-compat. Phase 1 REVIEW WR-02 confirmed no caller passed it (verified by `grep -rnE '<FlowLayout[^>]*padding=' src/app` returning empty), so removal is a zero-cost break. Reintroduces a typed pair (`px?`, `py?`) sized to the two real consumer shapes the spec actually requires."
  - "Defaults are `px=6` and `py=6` (= 48px uniform), preserving Phase 1's visual baseline for every existing route stub that consumes only the default. No visual regression on `/`, `/welcome`, `/permissions`, `/select-provider`, `/connecting`, or `/success` after this refactor."
  - "Brand-spec literals (`'12px'` borderRadius, `'0 2px 8px rgba(0,0,0,0.08)'` shadow) stay verbatim — the canonical Plan 01-02 SUMMARY decision is preserved. Only the spacing primitive moved to theme tokens; the spec-contract values remain hardcoded as intended."
metrics:
  duration_seconds: 65
  duration_human: "1m 5s"
  completed: "2026-05-18T15:57:51Z"
  tasks_total: 1
  tasks_completed: 1
  files_created: 0
  files_modified: 1
  commits: 1
---

# Phase 2 Plan 01: FlowLayout padding API widening — Summary

**One-liner:** Replaced FlowLayout's broken `padding: number` scalar (which interpolated to raw px and bypassed MUI theme spacing) with a `px?: number` + `py?: number` pair that consumes theme-spacing units natively, unblocking Wave-2's split-padding `/permissions` shape and closing Phase 1 REVIEW WR-01 + WR-02 with zero visual regression on the six existing route stubs.

## What landed

- **`src/components/FlowLayout.tsx` exports a new prop shape.** `FlowLayoutProps` is now exactly `{ children: ReactNode; maxWidth?: number; px?: number; py?: number }` — the old `padding?: number` field is gone. Both new props are typed `number` and consume MUI theme-spacing units (default of 8px/unit applies, so `px={6}` = 48px and `px={4.5}` = 36px). Defaults are `px = 6` and `py = 6` (= 48px uniform), matching the spec's `/welcome` panel and preserving Phase 1's exact visual baseline for every existing caller.
- **The Paper's `sx.p: `${padding}px`` is gone.** Replaced with `px,` and `py,` — MUI's native theme-spacing path. No raw px string interpolation anywhere in the component. The Paper's brand-spec contract values (`borderRadius: '12px'`, `boxShadow: '0 2px 8px rgba(0,0,0,0.08)'`, `backgroundColor: 'background.paper'`, `width: '100%'`, `maxWidth`) all stay verbatim per Plan 01-02's canonical decision.
- **No callers required changes.** Phase 1 REVIEW WR-02 already noted that none of the six route stubs (`/`, `/welcome`, `/permissions`, `/select-provider`, `/connecting`, `/success`) was passing the `padding` prop — they all relied on the default. The same default (48px uniform) still resolves through the new API. `grep -rnE "<FlowLayout[^>]*padding=" src/app` returns empty before and after this plan.
- **The JSDoc block at the top of the file is updated in place.** It now describes the new prop shape (`px` and `py` are theme-spacing units, defaults are 6/6 = 48px uniform, `/permissions` will pass `px={4.5} py={6}` for the spec-mandated split) and references that the change closes WR-01 + WR-02.
- **Phase 1 REVIEW findings WR-01 and WR-02 are closed.** WR-01 (px-string interpolation defeats MUI's theme.spacing): fixed by switching to native theme-spacing numbers. WR-02 (single scalar can't express the spec's `/permissions` 36/48 split): fixed by splitting padding into `px` and `py`.

## Tasks executed

| Task | Name                                                                                  | Commit    | Files                              |
| ---- | ------------------------------------------------------------------------------------- | --------- | ---------------------------------- |
| 1    | Widen FlowLayout's padding API to px + py (theme-spacing units)                       | `f7e85b1` | `src/components/FlowLayout.tsx`    |

## Verification evidence

All acceptance-criteria grep checks ran clean:

- `npx tsc --noEmit` → exit `0` (clean compile across the whole project after the refactor).
- `grep -nE "px\?:[[:space:]]*number" src/components/FlowLayout.tsx` → `1` match (line 31: `px?: number;`).
- `grep -nE "py\?:[[:space:]]*number" src/components/FlowLayout.tsx` → `1` match (line 32: `py?: number;`).
- `grep -cE "padding\?:[[:space:]]*number" src/components/FlowLayout.tsx` → `0` (old prop removed).
- `grep -nE "px[[:space:]]*=[[:space:]]*6" src/components/FlowLayout.tsx` → match (line 38: `px = 6,`).
- `grep -nE "py[[:space:]]*=[[:space:]]*6" src/components/FlowLayout.tsx` → match (line 39: `py = 6,`).
- `grep -cE '\$\{padding\}px' src/components/FlowLayout.tsx` → `0` (raw-px interpolation gone — WR-01 closed).
- Brand-spec literals preserved verbatim in the Paper `sx`: `borderRadius: '12px'` on line 55, `boxShadow: '0 2px 8px rgba(0,0,0,0.08)'` on line 56. (Each literal also appears once in the file's JSDoc block at lines 14-15, which documents them as the spec-mandated values — this is the same JSDoc convention established by Plan 01-02.)
- `grep -rnE "<FlowLayout[^>]*padding=" src/app` → empty (no caller was passing `padding`, so removing the prop cannot break any caller — confirms the WR-02 dead-prop finding).
- Hygiene: `grep -nE "console\.log" src/components/FlowLayout.tsx` → empty; `grep -nE "(^|[^a-zA-Z_]): *any( |;|,|>|$)" src/components/FlowLayout.tsx` → empty.
- Plan-level verification block ran clean: `tsc` exit `0`; `grep -cE "padding\?:" src/components/FlowLayout.tsx` → `0`; `grep -cE "(px|py)\?:[[:space:]]*number" src/components/FlowLayout.tsx` → `2`.

## Deviations from Plan

None — Plan 02-01 executed exactly as written. The single task ran end-to-end without auto-fixes, blockers, or architectural questions. The plan correctly anticipated that no caller required edits (verified before commit), so the refactor stayed scoped to a single file.

## Authentication gates

None — Plan 02-01 has no network surface, no API keys, no auth interactions. Pure local source-file refactor of a presentational component.

## Known Stubs

None new. The `FetchLogo` SVG placeholder noted in Plan 01-02's SUMMARY is unchanged and remains the only intentional, plan-sanctioned stub in the codebase.

## Threat Flags

None. STRIDE register entry T-02-01-01 (Tampering of FlowLayout API shape — `accept` disposition) is satisfied: the default-export signature stays binary-compatible for the six route stubs that don't pass padding props. Visual smoke tests against the existing stubs land in Wave-2 plans 02-02/02-03/02-04 per the plan's mitigation note. No new trust boundary introduced.

## Deferred Issues

None from this plan. The Plan 01 `postcss` advisory remains deferred to Phase 4 hardening.

## Phase 1 REVIEW findings resolved

- **WR-01 (FlowLayout padding prop bypasses MUI's spacing system and is silently mistyped)** ✅ Resolved. The component now applies `px` and `py` as native theme-spacing numbers through MUI's `sx` shorthand — no raw px string interpolation remains.
- **WR-02 (FlowLayout `padding` prop is dead — not consumed by any caller, and the wrong shape for its only intended consumer)** ✅ Resolved. The dead `padding` prop is removed; the new `px`/`py` pair is sized to the two consumer shapes the spec actually requires (`/welcome` uniform 48/48, `/permissions` split 36/48).

## Phase 2 requirements progress

Plan 02-01 carries `requirements: [WR-01, WR-02]` in its frontmatter. Both are now closed. Phase 2's screen-level requirements (`/welcome`, `/permissions`, `/select-provider` swap-ins) land in the Wave-2 plans 02-02 / 02-03 / 02-04, which this plan unblocks.

## Self-Check: PASSED

Modified files (verified to exist):
- `src/components/FlowLayout.tsx` — FOUND

Commits (verified in `git log`):
- `f7e85b1` refactor(02-01): widen FlowLayout padding API to px + py theme-spacing units — FOUND
