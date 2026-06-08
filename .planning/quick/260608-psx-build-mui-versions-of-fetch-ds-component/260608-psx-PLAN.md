---
phase: quick-260608-psx
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/theme/theme.ts
  - src/components/OptionRow.tsx
  - src/components/Chip.tsx
  - src/components/Input.tsx
  - src/components/Link.tsx
  - CLAUDE.md
  - .planning/STATE.md
autonomous: true
requirements: [DS-OPTIONROW, DS-CHIP, DS-INPUT, DS-LINK, DS-TOKENS-STATUS, DS-MAPPING]
must_haves:
  truths:
    - "tokens.status exists in theme.ts with warning/success/rejection/info/neutral fg+bg pairs"
    - "OptionRow renders a selectable Card+CardActionArea with navy hover/selected and a ChevronRight icon"
    - "Chip renders a filled rounded-rect status pill across 5 severities and 2 sizes"
    - "Input is a thin outlined size-small TextField wrapper with navy focus and native error"
    - "Link is a thin MUI Link wrapper, navy, underline-on-hover, sm=code / md=body2"
    - "Every component reads only theme palette keys + tokens — zero literal hex / raw 'Npx' in component files"
    - "CLAUDE.md has the Figma-to-code mapping table + the v2-screens-must-use-DS-components rule line"
  artifacts:
    - path: "src/theme/theme.ts"
      provides: "tokens.status object"
      contains: "status:"
    - path: "src/components/OptionRow.tsx"
      provides: "Selectable option row"
      min_lines: 30
    - path: "src/components/Chip.tsx"
      provides: "Status pill"
      min_lines: 20
    - path: "src/components/Input.tsx"
      provides: "Outlined TextField wrapper"
      min_lines: 20
    - path: "src/components/Link.tsx"
      provides: "Navy link wrapper"
      min_lines: 15
    - path: "CLAUDE.md"
      provides: "Figma-to-code component mapping section"
      contains: "Figma"
  key_links:
    - from: "src/components/Chip.tsx"
      to: "tokens.status"
      via: "tokens.status[severity]"
      pattern: "tokens\\.status\\["
    - from: "src/components/OptionRow.tsx"
      to: "@mui/icons-material/ChevronRight"
      via: "default import"
      pattern: "ChevronRight"
---

<objective>
Build the four MUI Design-System primitives the v2 screens will need — OptionRow, Chip, Input, Link — plus the `tokens.status` extension they depend on, all built EXACTLY to the authoritative Figma spec. "Components before screens."

Purpose: v2 screens must be assembled from DS components, never raw MUI primitives. These four are the missing primitives. The spec has already reconciled every Figma-vs-notes conflict (navy interactive color, rounded-rect chips, neutral = text-muted on background-page) — build to the spec verbatim; do not re-derive values or re-open decisions.

Output: `tokens.status` in theme.ts; four new components in `src/components/`; a Figma-to-code mapping section in CLAUDE.md; STATE.md updated with the quick-task log + divergence ledger.

OUT OF SCOPE (do NOT build): wiring components into screens, v2 flow order, screen files, any demo/storybook page. Components only.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/quick/260608-psx-build-mui-versions-of-fetch-ds-component/260608-psx-FIGMA-SPEC.md
@CLAUDE.md
@src/theme/theme.ts
@src/components/Button.tsx
@src/components/PermissionItem.tsx
@src/components/FetchLogo.tsx

<interfaces>
<!-- Existing patterns the executor MUST mirror. No codebase exploration needed. -->

Existing tokens export (src/theme/theme.ts) — append `status` to this object:
  export const tokens = {
    radius: { xs: 4, sm: 6, md: 8, lg: 12, xl: 16, full: 9999 },
    space: [4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96],
    text: { body2Medium {500/14/20}, chip {500/13/20}, sectionLabel {600/12/16}, code {400/13/20} },
  } as const;

DS component file conventions (from Button.tsx / PermissionItem.tsx):
- 'use client' on line 1 for components with interaction/event handlers. OptionRow (onClick), Input (controlled onChange), and Link (onClick) all take handlers → all three need 'use client'. Chip is purely presentational → no directive (mirror PermissionItem).
- Deep MUI imports, one per line: `import Card from '@mui/material/Card'` — NOT barrel `{ Card } from '@mui/material'`.
- Icon import shape: `import ChevronRightIcon from '@mui/icons-material/ChevronRight'`.
- `import { tokens } from '@/theme/theme'` for radius/space/text/status.
- Typography sizing via `sx={{ ...tokens.text.X }}` (see PermissionItem line 21) or MUI `variant`.
- Colors via palette keys ONLY: `color: 'text.primary'`, `bgcolor: 'background.paper'`, `borderColor: 'divider'`, `'secondary.main'`, `'error.main'`. NEVER a hex literal.
- Spacing via MUI sx shorthand (`p: 2` = 16px, `gap: 1.5` = 12px). NEVER a `'Npx'` string literal.
- Named export + `export default` (mirror Button/PermissionItem).
- Strict TS: no `any`. Type event handlers explicitly.

lint:tokens forbids only two literal forms inside src/*.ts(x): a `#hex` literal and a quoted `'Npx'` string. Bare numeric `fontSize: 14` is allowed; `rgba(...)` is allowed.
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Extend tokens.status + build the four DS components</name>
  <files>src/theme/theme.ts, src/components/OptionRow.tsx, src/components/Chip.tsx, src/components/Input.tsx, src/components/Link.tsx</files>
  <action>
1a. theme.ts — append `status` to the `tokens` object (theme.ts is the ONLY file allowed to hold raw values). Add it EXACTLY as the spec "Prereq" section specifies: warning {fg #f59e0b / bg #fef9c3}, success {fg #22c55e / bg #f0fdf4}, rejection {fg #ef4444 / bg #fee2e2}, info {fg #4338ca / bg #eef2ff}, neutral {fg #64748b / bg #fafafa}. Use the Figma-resolved neutral (#64748b / #fafafa), NOT the notes' draft (#475569 / #f1f5f9). Keep `as const` on `tokens`. Add a one-line comment noting Figma is the source.

1b. OptionRow.tsx (spec §1, node 426:78) — 'use client'. Props `{ title: string; description?: string; selected?: boolean; disabled?: boolean; onClick?: () => void }`. MUI `Card` wrapping `CardActionArea`. CardActionArea content: horizontal flex (`alignItems: 'center'`, `gap: 1.5` = 12px, `p: 2` = 16px). Left column `flex: 1`, vertical, `gap: 0.25` = 2px: title via `sx={{ ...tokens.text.body2Medium, color: 'text.primary' }}`; description (render ONLY when provided) via `<Typography variant="caption" sx={{ color: 'text.secondary' }}>`. Right: `ChevronRightIcon` from `@mui/icons-material/ChevronRight`, color `text.secondary` default, `secondary.main` (navy) when `selected`. Card: `bgcolor: 'background.paper'`, `borderRadius: tokens.radius.lg` (12 — nearest on-scale to Figma's off-scale 10px per spec divergence), `width: '100%'`, border 1px solid `divider`. States: hover (not disabled/selected) → border 1px `secondary.main` + soft elevation `0px 2px 4px rgba(92,102,242,0.18)` (rgba() is allowed; NO #hex, NO bare 'Npx' string); selected → border 2px `secondary.main`; disabled → pass `disabled` to CardActionArea, `opacity: 0.5`, border stays 1px `divider`. Pass `onClick` to CardActionArea.

1c. Chip.tsx (spec §2, node 326:110) — presentational, no 'use client'. Props `{ label: string; severity: 'warning'|'success'|'rejection'|'info'|'neutral'; size?: 'small'|'medium' }`, default `size='small'`. Filled variant only. Build on a MUI `Box` (inline-flex, items center, justify center). `bgcolor: tokens.status[severity].bg`, `color: tokens.status[severity].fg`, label typography via `sx={{ ...tokens.text.chip }}`. Read severity values THROUGH `tokens.status[severity]` — do not inline any color. Geometry = rounded RECTANGLE per spec divergence (NOT pill / radius.full): small → `px: 1` (8px), `py: 0.25` (2px), `borderRadius: tokens.radius.sm` (6); medium → `px: 1.5` (12px), `py: 0.5` (4px), `borderRadius: tokens.radius.md` (8).

1d. Input.tsx (spec §3, node 378:141) — 'use client' (controlled input). Thin wrapper over MUI `TextField` (`variant="outlined"`, `size="small"`). Props `{ label?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; type?: string; error?: boolean; helperText?: string; disabled?: boolean; fullWidth?: boolean }`, default `fullWidth = true`. Pass `error` straight through (MUI renders error outline+label natively from `error.main`). `sx` mapping (theme keys only): `borderRadius: tokens.radius.md` (8) on the outline; default notched-outline border color `divider`; focus → notched outline `secondary.main` (navy) 2px + floating label `secondary.main` — override MUI's default purple focus to navy by targeting `.Mui-focused .MuiOutlinedInput-notchedOutline` and `.MuiInputLabel-root.Mui-focused`; default label color `text.disabled`. Input text inherits body1. Do NOT add md/lg sizes (single size="small" per spec).

1e. Link.tsx (spec §4, node 338:92) — 'use client' (takes onClick). Thin wrapper over MUI `Link`. Props `{ children: React.ReactNode; onClick?: () => void; href?: string; size?: 'sm'|'md' }`, default `size='md'`. `color: 'secondary.main'` (navy), `underline: 'hover'`. Typography: `sm` → `sx={{ ...tokens.text.code }}` (code 13/20); `md` → body2 sizing (`fontSize: 14, lineHeight: 20/14`) — bare numerics, lint:tokens-safe. fontWeight stays 400 (carried by body2/code — do NOT override to 500). Pass `href` and `onClick` through.

Every component: deep MUI imports (one per line), `import { tokens } from '@/theme/theme'`, named + default export, strict TS (no `any`), no console.log. ZERO literal hex and ZERO `'Npx'` string literals in any of the four component files. Add no new dependencies — `@mui/icons-material` already present.
  </action>
  <verify>
    <automated>cd /Users/semenbronnikov/Documents/ai-ui-lab/fetch-gateway-gsd && npx tsc --noEmit && npm run lint && npm run lint:tokens && npm run build && git diff --quiet package.json && echo DEPS_UNCHANGED</automated>
  </verify>
  <done>tokens.status exists with all 5 severities (fg+bg) using the Figma neutral value; all four components exist in src/components/ built to spec (OptionRow = Card+CardActionArea+ChevronRight+navy hover/selected; Chip = filled rounded-rect, 5 severities × 2 sizes, reads tokens.status[severity]; Input = outlined size-small TextField, navy focus, native error; Link = navy MUI Link, underline hover, sm=code/md=body2, weight 400); tsc/lint/lint:tokens/build all PASS; package.json deps unchanged; every variant/state reachable via props.</done>
</task>

<task type="auto">
  <name>Task 2: CLAUDE.md Figma-to-code mapping + STATE.md log & divergence ledger</name>
  <files>CLAUDE.md, .planning/STATE.md</files>
  <action>
2a. CLAUDE.md (spec §5) — Add a new `## Figma <-> Code Component Mapping` section (place it logically near the Conventions/Architecture sections). Include the EXACT table from spec §5 with columns `Figma component | Code | Figma node`, covering: Button (323:128), Input (378:141), Chip (326:110), OptionRow (426:78), Link (338:92), AuthLogoCluster / FetchLogo (397:58), PermissionItem (—), FlowLayout (—). Then add the rule line VERBATIM: "v2 screens MUST be assembled from these components — never raw MUI primitives where a DS component exists. Main DS file: `pZYTXYGKR5lJAcaE0SnzLV`." (CLAUDE.md is markdown — node IDs and file paths only; no #hex / 'Npx' literals.)

2b. STATE.md — Append a row to the "Quick Tasks Completed" table for `260608-psx` / slug `build-mui-versions-of-fetch-ds-component` / date 2026-06-08 / verdict COMPLETE / notes: built OptionRow/Chip/Input/Link + tokens.status; all gates (tsc/lint/lint:tokens/build) PASS; no new deps. Then record the DIVERGENCE LEDGER (spec bottom, 6 items) as a short bullet block under the table so the resolved decisions are documented: (1) interactive color = navy secondary.main (user-confirmed, not purple); (2) Chip = rounded rectangle radius.sm/md, py 2/4 (not pill radius.full); (3) Chip neutral = #64748b on #fafafa (not #475569/#f1f5f9 — "neutral-bg backfill" flag resolved, neutral reuses background-page, no new DS token); (4) OptionRow radius uses tokens.radius.lg (12) — nearest on-scale to Figma's off-scale 10px; (5) Link weight 400 + sm=code 13/20 (not 500 / caption 12/16); (6) component widths fluid (fullWidth/100%) — Figma's fixed 360/320px owned by screens. Update the "Last updated" line at the top of STATE.md to reference this quick task. NOTE: STATE.md lives under .planning/ which lint:tokens does NOT scan, so the hex values in the divergence notes are safe there.
  </action>
  <verify>
    <automated>cd /Users/semenbronnikov/Documents/ai-ui-lab/fetch-gateway-gsd && grep -q "Figma" CLAUDE.md && grep -q "v2 screens MUST be assembled" CLAUDE.md && grep -q "pZYTXYGKR5lJAcaE0SnzLV" CLAUDE.md && grep -q "260608-psx" .planning/STATE.md && grep -qi "rounded rectangle" .planning/STATE.md && echo DOCS_OK</automated>
  </verify>
  <done>CLAUDE.md has the Figma-to-code mapping table (all 8 rows) + the verbatim DS-components rule line incl. the DS file key; STATE.md has the 260608-psx quick-task row and the 6-item divergence ledger; STATE.md "Last updated" references this task.</done>
</task>

</tasks>

<verification>
Run from repo root after both tasks:
- `npx tsc --noEmit` → exits 0 (strict TS, no `any`)
- `npm run lint` → passes
- `npm run lint:tokens` → prints the PASS line (zero off-token hex/px in src/ outside theme.ts + providers.ts)
- `npm run build` → succeeds
- `git diff --quiet package.json` → no dependency changes
- `ls src/components/{OptionRow,Chip,Input,Link}.tsx` → all four exist
- Spot-check each component exposes every variant/state via props (compile-level reachability; no screen wiring).
</verification>

<success_criteria>
- tokens.status appended to theme.ts with all 5 severities (Figma neutral value).
- OptionRow, Chip, Input, Link built to spec verbatim, MUI-only, theme/tokens only, strict TS, no console.log, zero literal hex / raw px in component files.
- No new dependencies added.
- CLAUDE.md carries the Figma-to-code mapping table + the v2-screens rule line.
- STATE.md logs the quick task + the 6-item divergence ledger.
- All five acceptance gates (tsc, lint, lint:tokens, build, deps-unchanged) PASS.
- OUT-OF-SCOPE respected: no screen wiring, no flow-order changes, no screen files, no demo/storybook page.
</success_criteria>

<output>
Create `.planning/quick/260608-psx-build-mui-versions-of-fetch-ds-component/260608-psx-SUMMARY.md` when done. Record the divergence ledger (6 items) in the summary per the spec's instruction.
</output>
