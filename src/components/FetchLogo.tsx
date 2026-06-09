import Image from 'next/image';
import NextLink from 'next/link';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { tokens } from '@/theme/theme';

// FetchLogo — the Fetch auth/header lockup: the horizontal logo (blue gradient
// arrows mark + "Fetch" wordmark, from the Plantegrity Phase-1 Figma file) over
// the "CONNECT · SYNC · SIMPLIFY" tagline — i.e. the Figma "AuthLogoCluster"
// (node 459:147 in the Fetch Design System). Every card across the auth + v2
// flows uses this cluster, so it's the default here.
//
// Public API (named export `FetchLogo`):
//   - `size`    — HEIGHT in px of the logo, used ONLY in bare mode (tagline=false).
//                 In cluster mode the logo fills the tagline's width, so `size`
//                 does not drive it. Width derives from the native 1960:802 ratio.
//   - `color`   — theme palette-token reference (default 'secondary.main', the DS
//                 navy ink); applied via the CSS `color` channel (forward-proofs an
//                 inline-SVG swap that reads `currentColor`). The raster is not
//                 recolored. Zero hardcoded color values live in this file.
//   - `title`   — img alt text.
//   - `tagline` — render the "CONNECT · SYNC · SIMPLIFY" tagline below the logo
//                 (default true). Pass `tagline={false}` for a bare logo.
//   - `href`    — where clicking the logo navigates (default `/`, the demo home).
//                 The whole logo is a link, so every Fetch logo leads home.
//
// The tagline is the DS section-label type (tokens.text.sectionLabel) in the
// muted ink (text.disabled) with the DS letter-spacing — theme/tokens only, no
// hardcoded hex or px.

export type FetchLogoProps = {
  size?: number;
  color?: string;
  title?: string;
  tagline?: boolean;
  href?: string;
};

export function FetchLogo({
  size = 40,
  color = 'secondary.main',
  title = 'Fetch',
  tagline = true,
  href = '/',
}: FetchLogoProps) {
  // Bare logo (tagline=false): `size` is the rendered HEIGHT; width derives from
  // the native 1960:802 aspect ratio.
  const content = !tagline ? (
    (() => {
      const width = Math.round(size * (1960 / 802));
      return (
        <Image
          src="/images/fetch-logo.png"
          alt={title}
          width={width}
          height={size}
          style={{ width, height: size, display: 'block', objectFit: 'contain', color }}
          priority
        />
      );
    })()
  ) : (
    // Cluster (default): the logo fills the SAME WIDTH as the tagline line. The
    // tagline (nowrap) is the only width-defining child, so `width: fit-content`
    // sizes the cluster to it. The logo sits in a `width: 100%` aspect-ratio box
    // with a `fill` image — that box has zero intrinsic width (its content is
    // out of flow), so it never widens the cluster; it just fills the tagline
    // width with height derived from the native 1960:802 ratio.
    <Stack spacing={0} sx={{ alignItems: 'center', width: 'fit-content' }}>
      <Box sx={{ position: 'relative', width: '100%', aspectRatio: '1960 / 802' }}>
        <Image
          src="/images/fetch-logo.png"
          alt={title}
          fill
          sizes="200px"
          style={{ objectFit: 'contain', color }}
          priority
        />
      </Box>
      <Typography
        component="p"
        sx={{
          ...tokens.text.sectionLabel,
          color: 'text.disabled',
          letterSpacing: '0.08em',
          whiteSpace: 'nowrap',
          textAlign: 'center',
        }}
      >
        CONNECT · SYNC · SIMPLIFY
      </Typography>
    </Stack>
  );

  // The whole logo is a link to the demo home. Inline-flex so it shrinks to the
  // logo; inherit color + no underline so the link chrome doesn't alter the mark.
  return (
    <NextLink
      href={href}
      aria-label={`${title} — go to the demo home`}
      style={{ display: 'inline-flex', textDecoration: 'none', color: 'inherit' }}
    >
      {content}
    </NextLink>
  );
}

export default FetchLogo;
