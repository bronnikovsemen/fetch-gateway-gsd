# Figma Spec (authoritative) — DS Components 260608-psx

Pulled live from Figma "Fetch Design System" (key `pZYTXYGKR5lJAcaE0SnzLV`) via Figma MCP on 2026-06-08.
These are the GROUND-TRUTH values. Where Figma disagreed with the task notes, **Figma wins** (per the task's explicit rule). Divergences are flagged inline and collected at the bottom.

**User decision (confirmed):** Interactive color follows Figma = **navy `#0a2540` (Brand Primary → our `secondary.main`)** for Link text, Input focus, and OptionRow selected/hover. Primary buttons stay purple (`brand-accent #635bff` → `primary.main`).

Theme reference (already in `src/theme/theme.ts`):
- `palette.primary.main` = `#635bff` (purple accent)
- `palette.secondary.main` = `#0a2540` (navy / Brand Primary)
- `palette.text.primary` = `#020810`, `text.secondary` = `#475569`, `text.disabled` = `#64748b` (Text Muted)
- `palette.background.default` = `#fafafa`, `background.paper` = `#ffffff`, `divider` = `#e2e8f0`
- `palette.error.main` = `#ef4444` (Rejection), `success.main` = `#22c55e`, `warning.main` = `#f59e0b`, `info.main` = `#4338ca`
- `tokens.radius` = `{ xs:4, sm:6, md:8, lg:12, xl:16, full:9999 }`
- `tokens.space` = `[4,8,12,16,20,24,32,40,48,56,64,80,96]`
- `tokens.text` = `{ body2Medium(500/14/20), chip(500/13/20), sectionLabel(600/12/16), code(400/13/20) }`

---

## Prereq — append `status` to `tokens` (theme.ts only)

```ts
status: {
  warning:  { fg: '#f59e0b', bg: '#fef9c3' },
  success:  { fg: '#22c55e', bg: '#f0fdf4' },
  rejection:{ fg: '#ef4444', bg: '#fee2e2' },
  info:     { fg: '#4338ca', bg: '#eef2ff' },
  neutral:  { fg: '#64748b', bg: '#fafafa' }, // Figma neutral filled chip = text-muted on background-page
},
```

> **Divergence from notes:** notes drafted `neutral: { fg:'#475569', bg:'#f1f5f9' }` and flagged "DS lacks a neutral-bg token — backfill." Figma's actual neutral *filled* chip uses `bg = background-page (#fafafa)` and `fg = text-muted (#64748b)`. Figma wins → use those. The "neutral-bg backfill" flag is **resolved** (neutral reuses background-page; no new DS token needed). `#fafafa` === `background.default` and `#64748b` === `text.disabled` in our theme, but we keep the raw values inside `tokens.status` (theme.ts is the only allowed home for raw values) so Chip can read `tokens.status[severity]` uniformly.

---

## 1. OptionRow — Figma node 426:78  →  `src/components/OptionRow.tsx`

**Props:** `title: string; description?: string; selected?: boolean; disabled?: boolean; onClick?: () => void;`

**Structure:** MUI `Card` wrapping `CardActionArea`. Horizontal flex, `alignItems: center`, gap **12px** (`theme.spacing(1.5)`), padding **16px** (`theme.spacing(2)`).
- `bgcolor: background.paper`
- border: **1px solid `divider`** (default)
- borderRadius: **`tokens.radius.lg` (12)** — see divergence note.
- `width: 100%` (Figma is fixed 360px; our component is fluid — screens own width).

**Left column** (`flex: 1`, column, gap 2px → `theme.spacing(0.25)`):
- title → `tokens.text.body2Medium` (Inter Medium 14/20), color `text.primary`
- description (only when provided) → MUI `caption` variant (12/16), color `text.secondary`

**Right:** `@mui/icons-material/ChevronRight` (use the icon per notes; Figma drew a glyph "›").
- color `text.secondary` default; **`secondary.main` (navy)** when `selected`.

**States:**
- hover (not disabled/selected): border **1px `secondary.main`** + subtle elevation (e.g. a soft shadow `0px 2px 4px rgba(92,102,242,0.18)` — rgba is allowed, no hex/`'Npx'` literal — or a small theme elevation). Figma's shadow is purple-tinted.
- selected: border **2px `secondary.main`** + chevron `secondary.main`.
- disabled: `opacity: 0.5`, `pointer-events: none` (CardActionArea `disabled`), border 1px `divider`.

> **Divergences from notes/Figma:**
> - Figma radius is **10px** (off the DS scale xs4/sm6/md8/lg12/xl16). Using `tokens.radius.lg` (12) — nearest on-scale token, keeps `lint:tokens` green. Notes also said `lg`. Flag: add a `radius` token if exact 10px is later required.
> - Selected/hover color is **navy** (`secondary.main`), not purple — per confirmed user decision + Figma.

---

## 2. Chip — Figma node 326:110  →  `src/components/Chip.tsx`

**Props:** `label: string; severity: 'warning'|'success'|'rejection'|'info'|'neutral'; size?: 'small'|'medium';` (default `size='small'`). Filled variant only (notes don't request outlined).

**Structure:** inline-flex, items center, justify center. Build on a MUI primitive (`Box` or MUI `Chip` restyled via `sx`).
- `bgcolor: tokens.status[severity].bg`
- `color: tokens.status[severity].fg`
- label typography: `tokens.text.chip` (Inter Medium 13/20)

**Sizes (Figma filled geometry):**
| size | px (horiz) | py (vert) | radius |
|------|-----------|-----------|--------|
| small  | 8 → `theme.spacing(1)`   | 2 → `theme.spacing(0.25)` | `tokens.radius.sm` (6) |
| medium | 12 → `theme.spacing(1.5)` | 4 → `theme.spacing(0.5)`  | `tokens.radius.md` (8) |

Resulting heights ≈ 24px (small) / 28px (medium).

> **Divergences from notes:** notes said `borderRadius: tokens.radius.full` (pill) and `py 8/10`. Figma's filled chips are **rounded rectangles** (`radius.sm`/`radius.md`) with `py 2/4`. Figma wins → rounded-rect, not pill. (Screenshot confirms rounded rectangles.)

---

## 3. Input — Figma node 378:141  →  `src/components/Input.tsx`

Thin wrapper over MUI `TextField` (`variant="outlined"`, `size="small"`). MUI's outlined TextField renders the floating-label notch natively, matching Figma.

**Props:** `label?: string; value: string; onChange: (e) => void; placeholder?: string; type?: string; error?: boolean; helperText?: string; disabled?: boolean; fullWidth?: boolean;` (default `fullWidth = true`).

**Styling — `sx` mapping to theme keys only (no raw hex/px):**
- borderRadius: **`tokens.radius.md` (8)** — Figma uses `var(--radius/md, 8px)`. ✓
- default border: **`divider`** (`#e2e8f0`), 1px.
- focus: notched outline **`secondary.main` (navy)**, 2px; floating label color **`secondary.main`**. (Override MUI's default purple focus → navy.)
- error (`error` prop): outline + label **`error.main`** (`#ef4444`) — MUI handles this natively; just pass `error`.
- label default color: `text.disabled` (`#64748b`); input text `body1` (16/24) `text.primary`; placeholder `text.disabled`.

> **Divergences from notes:** notes said focus = `primary.main` (purple). Figma focus = **navy** (`secondary.main`) — per confirmed decision. (Figma also has md/lg sizes + label on/off variants; our wrapper keeps a single `size="small"` outlined TextField + optional `label`, which reproduces the look — screens don't need the extra sizes.)

---

## 4. Link — Figma node 338:92  →  `src/components/Link.tsx`

Thin wrapper over MUI `Link`.

**Props:** `children: React.ReactNode; onClick?: () => void; href?: string; size?: 'sm'|'md';` (default `size='md'`).

- color: **`secondary.main` (navy `#0a2540`)** — Figma binds Link text to "Brand Primary". (Variable def confirmed: `Brand Primary = #0a2540`.)
- typography: `md` → MUI `body2` (14/20); `sm` → `tokens.text.code` (13/20).
- `underline: 'hover'` (Figma underlines on hover only). ✓
- fontWeight: **Regular 400** (carried by the body2 / code styles — no override).

> **Divergences from notes:** notes said `color: primary.main` (purple), `fontWeight: 500`, and `sm = caption` (12/16). Figma: **navy**, **400**, and **sm = code 13/20**. Figma wins on all three.

---

## 5. CLAUDE.md — add "Figma ↔ code component mapping" section

Add a section (substitutes for Code Connect):

| Figma component | Code | Figma node |
|---|---|---|
| Button | src/components/Button.tsx | 323:128 |
| Input | src/components/Input.tsx | 378:141 |
| Chip | src/components/Chip.tsx | 326:110 |
| OptionRow | src/components/OptionRow.tsx | 426:78 |
| Link | src/components/Link.tsx | 338:92 |
| AuthLogoCluster / FetchLogo | src/components/FetchLogo.tsx | 397:58 |
| PermissionItem | src/components/PermissionItem.tsx | — |
| FlowLayout (panel chrome) | src/components/FlowLayout.tsx | — |

Rule line: **"v2 screens MUST be assembled from these components — never raw MUI primitives where a DS component exists. Main DS file: `pZYTXYGKR5lJAcaE0SnzLV`."**

---

## Divergence ledger (Figma wins) — record in SUMMARY

1. **Interactive color = navy** (`secondary.main #0a2540`), not purple, for Link / Input-focus / OptionRow-selection. *(User-confirmed.)*
2. **Chip = rounded rectangle** (`radius.sm`/`md`, `py 2/4`), not a pill (`radius.full`, `py 8/10`).
3. **Chip neutral** = `text-muted #64748b` on `background-page #fafafa` (not `#475569`/`#f1f5f9`). "neutral-bg backfill" flag resolved.
4. **OptionRow radius** Figma 10px is off-scale → use `tokens.radius.lg` (12), nearest on-scale token.
5. **Link weight 400** (not 500); **Link sm = code 13/20** (not caption 12/16).
6. **Component widths fluid** (`fullWidth`/100%); Figma's fixed 360/320px widths are owned by screens, not these primitives.
