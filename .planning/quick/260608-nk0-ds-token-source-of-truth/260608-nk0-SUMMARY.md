---
phase: quick-260608-nk0
plan: 01
subsystem: design-system
tags: [theme, design-tokens, mui, lint, refactor]
requires:
  - src/theme/theme.ts
  - src/lib/providers.ts (provider brand-color data — documented exception)
provides:
  - Figma DS as the single source of truth for design tokens
  - typed `tokens` export (radius + space + non-MUI text styles)
  - `npm run lint:tokens` enforcement (QUAL-05)
affects:
  - src/components/*
  - src/app/** (5 routes)
tech-stack:
  added: []
  patterns:
    - "All design values in src/ resolve through MUI palette/typography keys, theme.spacing(), or the exported tokens object"
    - "Grep-based portable token linter wired into package.json"
key-files:
  created: []
  modified:
    - src/theme/theme.ts
    - src/components/Button.tsx
    - src/components/FlowLayout.tsx
    - src/components/PermissionItem.tsx
    - src/components/FetchLogo.tsx
    - src/app/welcome/page.tsx
    - src/app/permissions/page.tsx
    - src/app/select-provider/page.tsx
    - package.json
    - .planning/REQUIREMENTS.md (docs — left unstaged for orchestrator)
    - .planning/PROJECT.md (docs — left unstaged for orchestrator)
decisions:
  - "MUI numeric borderRadius multiplier expressed as tokens.radius.X / tokens.radius.lg (not theme.shape.borderRadius division) to avoid MUI's number|string typing on shape.borderRadius"
  - "Off-DS-scale spacing values (36px) expressed as theme-spacing units (4.5) rather than forcing a non-existent tokens.space entry"
  - "FetchLogo color prop defaults to the theme-token name 'secondary.main' (no hex); applied as inline style.color (visual no-op on the current raster, forward-proofing an SVG swap)"
metrics:
  duration: ~14m
  completed: 2026-06-08
---

# Quick 260608-nk0: DS Token Source of Truth Summary

Made the Figma "Fetch Design System" (key `pZYTXYGKR5lJAcaE0SnzLV`) the single source of truth for design tokens: rewrote `theme.ts` to mirror the DS verbatim, refactored every component and the 5 routes to consume ONLY theme keys / the exported `tokens` object, and added a portable grep-based `lint:tokens` enforcement script (QUAL-05).

## What Changed

### Task 1 — Rewrite theme.ts to mirror the Figma DS + export tokens (commit `9d1cc71`)
- Palette rewritten to DS values: `primary.main #635bff` (purple accent), `secondary.main #0a2540` (navy), `background.default #fafafa`, `background.paper #ffffff`, `divider #e2e8f0`, `text.primary #020810` / `text.secondary #475569` / `text.disabled #64748b`, `success.main #22c55e`, `warning.main #f59e0b`, `error.main #ef4444`, `info.main #4338ca`. `contrastText: #ffffff` set on the dark surfaces (primary/secondary/success/error/info). No invented `.dark`/`.light` shades — MUI auto-derives.
- Full type scale applied: h4 (600/28/36), h5 (600/22/32), subtitle1 (600/16/24), body1 (400/16/24), body2 (400/14/20), button (600/14/20, textTransform none), caption (400/12/16), overline (600/11/16, uppercase).
- `shape.borderRadius = 12` (radius.lg).
- Added typed `export const tokens` with `radius`, `space` array, and the four non-MUI DS text styles (`body2Medium`, `chip`, `sectionLabel`, `code`) — preserved as `{ fontWeight, fontSize, lineHeight }`, `as const`.
- Source-of-truth comment repointed at the Figma DS; `Main_Fetch_Gateway.md` reference removed; no hex literals in comments.

### Task 2 — Refactor components + routes to consume theme/tokens only (commit `f143362`)
- **Button.tsx**: dropped literal `VARIANT_STYLES`/`SIZE_STYLES` hex+px. `primary` → `variant="contained"` `color="primary"`; `secondary` → `variant="text"` `color="secondary"` with tonal `action.hover`/`action.selected`. Sizes sourced from `tokens.space[...]` and `tokens.radius.md` via MUI-unit math. Public prop API (variant/size/loading/iconStart) unchanged.
- **FlowLayout.tsx**: `borderRadius` via `tokens.radius.lg / tokens.radius.lg` (= 12px through MUI's shape multiplier); page/paper bgcolors stay on `background.default`/`background.paper`; soft rgba shadow kept (not a hex/px literal); stale hex stripped from JSDoc.
- **PermissionItem.tsx**: check icon → `color: 'primary.main'`; label → `tokens.text.body2Medium` + `text.primary`; description → `variant="caption"` + `text.secondary`; hex stripped from comments.
- **FetchLogo.tsx**: added a `color` prop defaulting to the theme-token name `'secondary.main'` (no hex anywhere). Applied via inline `style.color` (visual no-op on the raster; forward-proofs an inline-SVG `currentColor` swap).
- **welcome / permissions / select-provider**: every `#F3FCFF`/`#FFFFFF` → `background.default`/`background.paper`; `#001639` → `text.primary`; `#6B7281` → `text.secondary`; `#005EFF` → `primary.main`; headings → `variant="h5"`, body → `variant="body2"`; px strings → `tokens.space[...]` MUI units or `tokens.radius` ratios; the Select tonal border (`#F3FCFF`) → `transparent` and focus/hover border → `primary.main`. All comment hex stripped.
- **page.tsx (splash) + connecting/page.tsx**: already token-clean — verified zero hex/px (code + comments); untouched.

### Task 3 — Add lint:tokens enforcement (QUAL-05) + docs (commit `a44b5bf` for package.json; docs left unstaged)
- Added `lint:tokens` npm script: portable POSIX `grep -rEn` scanning `src/*.ts(x)`, excluding `src/theme/theme.ts` and `src/lib/providers.ts`, failing (non-zero) on any `#[0-9a-fA-F]{3,8}` hex OR `'[0-9]+px'` string literal and printing the offending file:line; passing (exit 0) with a PASS line on a clean tree. Verified both directions: clean tree → exit 0; injected `"#abcdef"` probe → exit 1 with `src/__lint_probe.ts:1` printed.
- **.planning/REQUIREMENTS.md** (docs, unstaged): added QUAL-05 entry under Quality, a traceability row, and a coverage note.
- **.planning/PROJECT.md** (docs, unstaged): added the DS-source-of-truth Key Decision row and an INTENDED-visual-change note (purple primary, near-white bg, new success green, full type scale — not a regression).

## Acceptance Gates

| Gate | Command | Result |
|------|---------|--------|
| 1. TypeScript | `npx tsc --noEmit` | **PASS** — exit 0, zero errors |
| 2. Token lint | `npm run lint:tokens` | **PASS** — exit 0, "lint:tokens PASS — no off-token hex or raw px in src/" |
| 3. Production build | `npm run build` | **PASS** — "Compiled successfully in 3.2s"; all 5 routes prerendered (`/`, `/welcome`, `/permissions`, `/select-provider`, `/connecting`) + `/_not-found`; 8/8 static pages generated |
| 3b. ESLint | `npm run lint` | **PASS** — "No ESLint warnings or errors" |

### Live runtime smoke
The pre-existing process on port 3001 was a **stale dev server** (predating this refactor) returning 500s; I did NOT start it and left it untouched. To verify my code renders, I started a fresh `next dev` on a temporary port 3099, smoked all 5 routes, and tore it down:

| Route | HTTP | Distinct SSR marker |
|-------|------|---------------------|
| `/` | 200 | "Retirement runs on Fetch" |
| `/welcome` | 200 | "Connect your payroll provider" |
| `/permissions` | 200 | "need access to:" |
| `/select-provider` | 200 | "Select your payroll provider" |
| `/connecting?provider=gusto` | 200 | "Connecting to Gusto" |

Rendered Emotion CSS on `/welcome` contained the DS purple `#635bff` and near-white `#fafafa` — confirming the intended visual change reached the browser. Server on 3099 torn down (port free).

## Token-source proof
`grep -rEn '#[0-9a-fA-F]{3,8}' src --include='*.ts' --include='*.tsx' | grep -vE 'theme\.ts|providers\.ts'` → no output. Zero `'Npx'` string literals outside theme.ts. theme.ts is the only design-token file; providers.ts holds provider brand-color DATA (documented exception).

## Deviations from Plan

None requiring user input. Two within-scope implementation choices (Rule 3 — blocking-issue resolution):

**1. [Rule 3 - Blocking] MUI `shape.borderRadius` typed as `number | string` broke arithmetic.**
- **Found during:** Task 2 (tsc gate)
- **Issue:** Dividing `tokens.radius.X / theme.shape.borderRadius` failed TS2363 because MUI types `shape.borderRadius` as `number | string`.
- **Fix:** Expressed the MUI radius multiplier as `tokens.radius.X / tokens.radius.lg` (both literal numbers from the DS, and `shape.borderRadius === tokens.radius.lg`), giving the identical pixel result without the string-union typing problem.
- **Files:** FlowLayout.tsx, welcome/permissions/select-provider page.tsx
- **Commit:** `f143362`

**2. [Rule 3 - Blocking] 36px panel padding has no DS-scale token.**
- **Issue:** `/permissions` and `/select-provider` use 36px vertical padding; the DS `space` scale jumps 32 → 40, so 36 isn't a token.
- **Fix:** Expressed as `py: 4.5` (= `theme.spacing(4.5)` = 36px) — a theme-spacing-unit value, satisfying "no raw px string literal" while preserving the exact spec padding. Documented as a decision.
- **Commit:** `f143362`

## Known Stubs
None. FetchLogo's `color` prop is a documented forward-proofing affordance (theme-token default, no hex), not a data stub — the logo intentionally remains a raster per prior project decisions.

## Self-Check: PASSED
- theme.ts modified, contains `export const tokens`, `635bff`, `22c55e`, `fafafa`, `pZYTXYGKR5lJAcaE0SnzLV`, no `Main_Fetch_Gateway` — verified by Task 1 gate (`THEME_OK`).
- Commits exist: `9d1cc71` (theme), `f143362` (refactor), `a44b5bf` (lint:tokens script) — all on `new-design-system`.
- `npx tsc --noEmit`, `npm run lint:tokens`, `npm run build`, `npm run lint` all pass.
- `lint:tokens` proven to fail on a reintroduced hex (exit 1) and pass on the clean tree (exit 0).
- Docs edits (REQUIREMENTS.md, PROJECT.md) made but left UNSTAGED for the orchestrator per constraints.
