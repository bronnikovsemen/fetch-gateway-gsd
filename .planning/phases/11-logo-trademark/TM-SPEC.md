# Phase 11 — Logo Trademark (™) — Spec

Overlay a small superscript ™ next to the Fetch wordmark inside `src/components/FetchLogo.tsx`. Do NOT edit the PNG. Single-component change. Theme/tokens only (lint:tokens green) — the ™ size derives from the `size` prop (bare numeric, NOT a `'Npx'` literal), color via theme `text.primary`.

## Prop
Add to `FetchLogoProps`: `trademark?: boolean;` — default `true` (the same logo is the shared header everywhere; allow `<FetchLogo trademark={false} />` to hide it per instance).

## The ™ element (shared, both modes)
Inside the component, after defaults:
```tsx
const tm = trademark ? (
  <Box
    component="span"
    aria-hidden
    sx={{
      alignSelf: 'flex-start',   // top of the wordmark → superscript look
      fontSize: size * 0.35,     // scales with the size prop (bare number, no 'Npx')
      lineHeight: 1,
      fontWeight: 600,
      color: 'text.primary',     // the dark wordmark navy
      ml: 0.25,                  // tiny left gap (theme spacing → 2px)
    }}
  >
    ™
  </Box>
) : null;
```

## Bare mode (tagline=false) — wrap Image + ™ in an inline-flex row
Replace the bare-mode return so the `<Image>` and `{tm}` sit in an inline-flex container with `alignItems: 'flex-start'`:
```tsx
const width = Math.round(size * (1960 / 802));
return (
  <Box sx={{ display: 'inline-flex', alignItems: 'flex-start' }}>
    <Image src="/images/fetch-logo.png" alt={title} width={width} height={size}
      style={{ width, height: size, display: 'block', objectFit: 'contain', color }} priority />
    {tm}
  </Box>
);
```
(Keep `content` then the `<NextLink>` wrapper as today — i.e. the bare-mode `content` becomes the inline-flex Box above.)

## Cluster mode (default) — add ™ as a sibling of the logo, preserve fit-content
The cluster's tagline (nowrap) must remain the width-defining child. Wrap ONLY the logo's aspect-ratio Box + ™ in an inline-flex row (`width: '100%'`); the logo Box becomes a flex child (`flex: 1, minWidth: 0`) so the ™ never widens the cluster (its intrinsic width is tiny and the logo Box has zero intrinsic width). The tagline still defines the cluster width.
```tsx
<Stack spacing={0} sx={{ alignItems: 'center', width: 'fit-content' }}>
  <Box sx={{ display: 'inline-flex', alignItems: 'flex-start', width: '100%' }}>
    <Box sx={{ position: 'relative', flex: 1, minWidth: 0, aspectRatio: '1960 / 802' }}>
      <Image src="/images/fetch-logo.png" alt={title} fill sizes="200px"
        style={{ objectFit: 'contain', color }} priority />
    </Box>
    {tm}
  </Box>
  <Typography component="p" sx={{ ...tokens.text.sectionLabel, color: 'text.disabled',
    letterSpacing: '0.08em', whiteSpace: 'nowrap', textAlign: 'center' }}>
    CONNECT · SYNC · SIMPLIFY
  </Typography>
</Stack>
```
(Only change vs today: the aspect Box `width: '100%'` → `flex: 1, minWidth: 0` and it's now inside the inline-flex row alongside `{tm}`.)

## Notes / constraints
- The ™ scales with `size` in both modes (e.g. size=40 → ~14px; size=56 → ~20px). `fontSize: size * 0.35` is a computed number, allowed by lint:tokens (only single-quoted `'Npx'` and `#hex` are flagged).
- `color: 'text.primary'` (theme), `ml: 0.25` (theme spacing) — no off-token values.
- Keep the existing `<NextLink href={href}>` wrapper around `content`; the logo stays a link to home.
- Do NOT modify `public/images/fetch-logo.png` or any other file. MUI v9 + Emotion; strict TS no `any`; no console.log; no new deps.

## Requirement
- **TM-01** — FetchLogo renders a superscript ™ at the top-right of the wordmark, scaling with the `size` prop, color text.primary; `trademark` prop (default true) toggles it per instance; PNG untouched; theme/tokens only.
