---
phase: 11
plan: 01
subsystem: ui-components
tags: [logo, trademark, branding, mui]
requires: [FetchLogo component, theme tokens]
provides: [FetchLogo ™ superscript, trademark prop]
affects: [every page using the shared FetchLogo header]
tech-stack:
  added: []
  patterns: [computed-fontSize-from-size-prop, inline-flex-superscript]
key-files:
  created: []
  modified: [src/components/FetchLogo.tsx]
decisions:
  - "™ fontSize is a computed number (size * 0.35) — passes lint:tokens (only 'Npx' literals and #hex flagged)"
  - "Cluster logo Box changed width:100% → flex:1,minWidth:0 so the nowrap tagline stays the width-defining child and the ™ never widens the cluster"
metrics:
  duration: ~5m
  completed: 2026-06-09
---

# Phase 11 Plan 01: Logo Trademark (™) Summary

Added a scalable superscript ™ to the top-right of the Fetch wordmark in `FetchLogo`, derived from the `size` prop, colored via theme `text.primary`, toggleable per instance with the new `trademark` prop (default `true`).

## What Was Built

`src/components/FetchLogo.tsx` (only file changed), per TM-SPEC.md verbatim:

1. **Prop** — `trademark?: boolean` added to `FetchLogoProps`; defaults to `true` in the destructure.
2. **Shared `tm` element** — a `Box component="span"` with `alignSelf:'flex-start'` (superscript), `fontSize: size * 0.35` (scales: size=40 → 14px, size=56 → ~19.6px), `lineHeight:1`, `fontWeight:600`, `color:'text.primary'`, `ml:0.25`, content `™`, `aria-hidden`. Resolves to `null` when `trademark={false}`.
3. **Bare mode** (`tagline={false}`) — `<Image>` + `{tm}` wrapped in an inline-flex `Box` (`alignItems:'flex-start'`).
4. **Cluster mode** (default) — the aspect-ratio logo `Box` + `{tm}` wrapped in an inline-flex row (`width:'100%'`); the logo `Box` changed from `width:'100%'` to `flex:1, minWidth:0` so the nowrap tagline remains the width-defining child and the ™ (tiny intrinsic width) never widens the cluster. Tagline `Typography` and the `<NextLink>` wrapper unchanged.

## Deviations from Plan

None — plan executed exactly as written (spec applied verbatim).

## Acceptance Gates

| Gate | Result |
| ---- | ------ |
| `npx tsc --noEmit` | 0 errors |
| `npm run lint` | clean (no ESLint warnings/errors) |
| `npm run lint:tokens` | PASS — no off-token hex or raw px |
| `npm run build` | compiles (all routes prerendered static) |
| `git diff --name-only` | ONLY `src/components/FetchLogo.tsx` (+ unstaged `.planning/`) |
| PNG untouched | `git status` empty for `public/images/fetch-logo.png` |
| Runtime `/` | 200 |
| Runtime `/welcome` (cluster) | 200, served HTML contains 1 ™ next to logo |

## Constraints Honored

- Theme/tokens only: `color:'text.primary'`, `ml:0.25`; `fontSize: size * 0.35` is a computed number (allowed). Zero literal hex, zero `'Npx'` string literals.
- Strict TS (no `any`), no `console.log`, no new deps, MUI v9 + Emotion.
- Touched only `src/components/FetchLogo.tsx`; PNG and all other files untouched.

## Commit

- `603d4ee`: feat(11-logo-trademark): add scalable ™ superscript to FetchLogo (TM-01)

## Self-Check: PASSED

- FOUND: src/components/FetchLogo.tsx
- FOUND: commit 603d4ee
