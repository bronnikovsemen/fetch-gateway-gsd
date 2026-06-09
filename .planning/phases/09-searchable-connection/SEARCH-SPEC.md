# Phase 09 — Searchable Connection dropdown — Spec

Make the "Connection" dropdown on `/select-provider` a searchable combobox (MUI `Autocomplete`) — type to filter. The CLOSED field must look IDENTICAL to today's DS-Input dropdown; only the behavior + the open list change. Single-file change to `src/app/select-provider/page.tsx`. No new deps (`@mui/material` Autocomplete). Theme/tokens only — lint:tokens green.

## Replace the field
Swap the `<Input select label="Connection">…</Input>` block for a MUI `Autocomplete`:
- `import Autocomplete from '@mui/material/Autocomplete'`, `import TextField from '@mui/material/TextField'`, `import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'`. Remove the now-unused `MenuItem` import and the DS `Input` import.
- Options = `providers` (each `{ slug, name, authMethod }`); `getOptionLabel={(o) => o.name}`; `isOptionEqualToValue={(a, b) => a.slug === b.slug}`.
- Controlled: keep `selected: Provider['slug'] | ''`. Derive `value = providers.find((p) => p.slug === selected) ?? null`. `onChange={(_, opt) => setSelected(opt ? opt.slug : '')}`.
- `disableClearable` (no clear "X" — only the chevron, like the select), `disabled={submitting}`, `fullWidth`, `forcePopupIcon`, `popupIcon={<KeyboardArrowDownIcon />}`.
- `noOptionsText="No connections found"`. Default MUI filtering is fine (no custom filterOptions).

## CLOSED field = identical to the current DS dropdown
`renderInput={(params) => <TextField {...params} label="Connection" placeholder="Search or select…" slotProps={{ inputLabel: { shrink: true } }} sx={FIELD_SX} />}`. Always-shrunk label keeps the notched "Connection" on the border (matching today). `FIELD_SX` reproduces the DS Input look:
```
'& .MuiOutlinedInput-root': { borderRadius: tokens.radius.md / tokens.radius.lg },
'& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
'& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'secondary.main', borderWidth: 2 },
'& .MuiInputLabel-root': { color: 'text.disabled' },
'& .MuiInputLabel-root.Mui-focused': { color: 'secondary.main' },
```
> NOTE: per the task, the focus border is navy `secondary.main` 2px (the task specifies this explicitly). The closed/unfocused look is unchanged.

Chevron parity (on the Autocomplete itself, via its `sx`):
```
'& .MuiAutocomplete-popupIndicator': { color: 'action.active' },
'& .MuiAutocomplete-popupIndicator:hover': { backgroundColor: 'transparent' },
```
(Autocomplete is `size="small"`-equivalent via the TextField; keep it visually the same height — do NOT pass `size="small"` to Autocomplete if it changes the look vs today; match today's field height. If today's DS Input is `size="small"`, mirror it.)

## Open list (Popper/Paper/options) — theme keys only
`slotProps={{ paper: { sx: { ... } } }}`:
```
bgcolor: 'background.paper',
border: '1px solid', borderColor: 'divider',
// Paper multiplies numeric borderRadius by shape.borderRadius(=radius.lg):
borderRadius: tokens.radius.md / tokens.radius.lg,
mt: 0.5,
'& .MuiAutocomplete-option': {
  // option typography via theme (e.g. body2-ish); color text.primary
  color: 'text.primary',
  '&.Mui-focused': { backgroundColor: 'action.hover' },
  '&[aria-selected="true"]': { backgroundColor: 'action.selected' },
  '&[aria-selected="true"].Mui-focused': { backgroundColor: 'action.selected' },
},
'& .MuiAutocomplete-noOptions': { color: 'text.secondary' },
```
ZERO literal hex / `'Npx'` — all via theme keys / tokens / the radius ratio trick.

## Behavior (unchanged downstream)
- Select an option → `selected` set → Continue enabled (`disabled={!selected}`). Continue still runs the existing loading submit → `router.push('/connect-method?provider=' + selected)`. Back unchanged (`/permissions`).
- Typing "pr" filters to Principal; empty filter → "No connections found".

## Constraints
MUI v9 + Emotion; strict TS (no `any`); no console.log; no new deps; port 3001; theme/tokens only (lint:tokens green). Touch ONLY `src/app/select-provider/page.tsx` — not other routes/components/providers.ts.

## Requirement
- **SEARCH-01** — `/select-provider` Connection field is a searchable Autocomplete combobox; closed look identical (white/bordered/radius.md/notched "Connection"/chevron-down/navy 2px focus); open list filters Gusto/Principal/SFTP with an "No connections found" empty state; select → Continue → /connect-method?provider=.
