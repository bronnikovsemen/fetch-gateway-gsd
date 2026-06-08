---
quick_id: 260608-psx
slug: build-mui-versions-of-fetch-ds-component
date: 2026-06-08
verdict: COMPLETE
subsystem: design-system
tags: [mui, design-system, figma, tokens, components]
requires: [tokens (theme.ts), '@mui/material', '@mui/icons-material']
provides: [OptionRow, Chip, Input, Link, tokens.status]
affects: [src/theme/theme.ts, src/components/, CLAUDE.md]
key-files:
  created:
    - src/components/OptionRow.tsx
    - src/components/Chip.tsx
    - src/components/Input.tsx
    - src/components/Link.tsx
  modified:
    - src/theme/theme.ts
    - CLAUDE.md
    - .planning/STATE.md
commits:
  - c4653fb (feat — 4 components + tokens.status)
  - a235d5d (docs — CLAUDE.md Figma<->code mapping)
metrics:
  tasks: 2
  files: 7
  new-deps: 0
---

# Quick Task 260608-psx: Build MUI Versions of Fetch DS Components Summary

Built the four missing MUI Design-System primitives the v2 screens need — **OptionRow, Chip, Input, Link** — plus the `tokens.status` extension they depend on, all built verbatim to the authoritative Figma spec (`260608-psx-FIGMA-SPEC.md`). "Components before screens": no screen wiring, no flow changes — primitives only.

## What was built

- **`tokens.status`** (theme.ts) — 5 severities with fg+bg pairs: warning `#f59e0b`/`#fef9c3`, success `#22c55e`/`#f0fdf4`, rejection `#ef4444`/`#fee2e2`, info `#4338ca`/`#eef2ff`, neutral `#64748b`/`#fafafa` (Figma neutral = text-muted on background-page). theme.ts is the only file holding these raw values; Chip reads `tokens.status[severity]` uniformly.
- **OptionRow.tsx** — `'use client'`; MUI `Card` + `CardActionArea`; horizontal flex (`gap 12px`, `p 16px`); left column title (`body2Medium`/`text.primary`) + optional caption description; right `ChevronRightIcon` (navy when selected). States: hover → 1px navy border + soft purple-tinted elevation `rgba(92,102,242,0.18)`; selected → 2px navy border + navy chevron; disabled → `opacity 0.5` + disabled CardActionArea + border stays 1px divider. Radius via `tokens.radius.lg` (12).
- **Chip.tsx** — presentational (no `'use client'`); MUI `Box` inline-flex; filled rounded-RECTANGLE (small: `px 8 / py 2 / radius.sm`; medium: `px 12 / py 4 / radius.md`); `bgcolor`/`color` read through `tokens.status[severity]`; label via `tokens.text.chip`.
- **Input.tsx** — `'use client'`; thin wrapper over outlined `size="small"` `TextField`; `borderRadius radius.md` (8); default outline `divider`; focus override → navy (`secondary.main`) 2px outline + navy floating label; default label `text.disabled`; `error` passed straight through for native MUI error rendering; single size only.
- **Link.tsx** — `'use client'`; thin wrapper over MUI `Link`; navy (`secondary.main`); `underline="hover"`; `md` → body2 sizing (14/20), `sm` → `tokens.text.code` (13/20); weight stays 400; `href` + `onClick` passed through.
- **CLAUDE.md** — new `## Figma <-> Code Component Mapping` section with the 8-row table (Button/Input/Chip/OptionRow/Link/FetchLogo/PermissionItem/FlowLayout + Figma nodes) and the verbatim rule line: "v2 screens MUST be assembled from these components — never raw MUI primitives where a DS component exists. Main DS file: `pZYTXYGKR5lJAcaE0SnzLV`."
- **STATE.md** — quick-task row + divergence ledger + "Last updated" line (left UNSTAGED for the orchestrator's docs commit).

## Acceptance gates (exact output)

| Gate | Command | Result |
|------|---------|--------|
| 1. tsc | `npx tsc --noEmit` | zero errors |
| 2. lint | `npm run lint` | `✔ No ESLint warnings or errors` |
| 3. lint:tokens | `npm run lint:tokens` | `lint:tokens PASS — no off-token hex or raw px in src/` |
| 4. build | `npm run build` | `✓ Compiled successfully in 1179ms` / `✓ Generating static pages (8/8)` |
| 5. deps | `git diff --quiet package.json` | `deps unchanged` |

Per-file token scan over the four new component files (`grep '#hex'` + `grep "'Npx'"`) returned **zero hits** — all values flow via theme palette keys / DS tokens / theme.spacing. `rgba(...)` in OptionRow's shadow is allowed by `lint:tokens`.

## Divergence ledger (Figma wins — recorded per spec)

1. **Interactive color = navy** (`secondary.main` #0a2540), not purple, for Link / Input-focus / OptionRow-selection. *(User-confirmed.)*
2. **Chip = rounded rectangle** (`radius.sm`/`md`, `py 2/4`), not a pill (`radius.full`, `py 8/10`).
3. **Chip neutral** = text-muted #64748b on background-page #fafafa (not #475569/#f1f5f9 — the "neutral-bg backfill" flag is resolved; neutral reuses background-page, no new DS token).
4. **OptionRow radius** uses `tokens.radius.lg` (12) — nearest on-scale token to Figma's off-scale 10px.
5. **Link weight 400** (not 500); **Link sm = code 13/20** (not caption 12/16).
6. **Component widths fluid** (`fullWidth`/100%); Figma's fixed 360/320px widths are owned by screens, not these primitives.

## Deviations from Plan

None — plan executed exactly as written. No Rule 1/2/3/4 deviations; no auth gates; no new dependencies. The Button-wrapper convention (`borderRadius: tokens.radius.X / tokens.radius.lg` to neutralize MUI's `shape.borderRadius` 12× multiplier) was mirrored in OptionRow/Chip/Input to produce the exact Figma px radii while keeping values token-sourced.

## Out of scope (respected)

No screen wiring, no v2 flow-order changes, no screen files, no demo/storybook page. Components only.

## Self-Check: PASSED

- FOUND: src/components/OptionRow.tsx, Chip.tsx, Input.tsx, Link.tsx
- FOUND: tokens.status in src/theme/theme.ts
- FOUND commit: c4653fb (feat — components + tokens.status)
- FOUND commit: a235d5d (docs — CLAUDE.md mapping)
