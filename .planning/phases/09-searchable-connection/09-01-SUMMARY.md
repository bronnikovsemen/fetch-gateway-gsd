---
phase: 09
plan: 01
subsystem: select-provider
tags: [mui, autocomplete, combobox, search]
requires: [providers, theme/tokens, components/Button]
provides: [searchable-connection-field]
affects: [src/app/select-provider/page.tsx]
tech-stack:
  added: []
  patterns: [mui-autocomplete-controlled, slotProps-paper-theming, clearIndicator-hide-for-nullable-value]
key-files:
  created: []
  modified: [src/app/select-provider/page.tsx]
decisions:
  - Hid clear indicator via sx (display:none) instead of disableClearable, to keep the controlled value nullable under strict TS.
metrics:
  duration: ~10m
  completed: 2026-06-09
requirements: [SEARCH-01]
---

# Phase 09 Plan 01: Searchable Connection dropdown Summary

Replaced the `/select-provider` DS-Input `select` with a MUI `Autocomplete` searchable combobox — type to filter Gusto/Principal/SFTP, with a "No connections found" empty state. The closed field reproduces the DS-Input outlined look (radius.md via the ratio trick, divider border, always-shrunk notched "Connection" label), with a navy `secondary.main` 2px focus border per spec. Continue/Back behavior is unchanged.

## What changed

`src/app/select-provider/page.tsx` (only file touched):
- Imports: added `Autocomplete`, `TextField`, `KeyboardArrowDownIcon`; removed now-unused `MenuItem` and DS `Input`.
- `Autocomplete` over `providers`: `getOptionLabel`, `isOptionEqualToValue` by slug, controlled `value = providers.find(p=>p.slug===selected) ?? null`, `onChange` sets the slug (or `''`).
- `forcePopupIcon`, `popupIcon={<KeyboardArrowDownIcon />}`, `disabled={submitting}`, `fullWidth`, `noOptionsText="No connections found"`, default filtering.
- `renderInput`: `TextField` with `label="Connection"`, `placeholder="Search or select…"`, always-shrunk label, and the DS-Input FIELD_SX with focus = `secondary.main` 2px navy.
- Open list themed via `slotProps.paper.sx`: `background.paper`, divider 1px border, radius via `tokens.radius.md / tokens.radius.lg`, option `text.primary` with `Mui-focused` → `action.hover` and `aria-selected` → `action.selected`; noOptions → `text.secondary`. Chevron color `action.active`, transparent hover.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] `disableClearable` conflicts with nullable controlled value under strict TS**
- **Found during:** Task 1 (tsc gate)
- **Issue:** With `disableClearable`, MUI narrows the `value` prop type to non-null, but the empty/unselected state requires `null`. `tsc` failed: `Type 'null' is not assignable...`. The spec forbids `any`/casts.
- **Fix:** Dropped `disableClearable` and instead hid the clear "X" visually with `'& .MuiAutocomplete-clearIndicator': { display: 'none' }` in the Autocomplete `sx`. Net behavior is identical (only the chevron shows, DS-Select parity) while keeping the controlled value nullable.
- **Files modified:** src/app/select-provider/page.tsx
- **Commit:** 7164193

## Acceptance Gates

- `npx tsc --noEmit` → 0 errors (after Rule 3 fix)
- `npm run lint` → clean, no unused imports
- `npm run lint:tokens` → PASS (zero off-token hex / raw px)
- `npm run build` → compiles; `/select-provider` present (○ static)
- `git diff --name-only` → only `src/app/select-provider/page.tsx` (+ unstaged `.planning/`)
- Runtime smoke: `/select-provider` → HTTP 200; served page chunk `page-a7db53fd4b63ec84.js` ships "Connection", "Search or select", "No connections found", and Gusto/Principal/SFTP.

## Self-Check: PASSED

- src/app/select-provider/page.tsx — FOUND
- Commit 7164193 — FOUND
