import Image from 'next/image';
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
//
// The tagline is the DS section-label type (tokens.text.sectionLabel) in the
// muted ink (text.disabled) with the DS letter-spacing — theme/tokens only, no
// hardcoded hex or px.

export type FetchLogoProps = {
  size?: number;
  color?: string;
  title?: string;
  tagline?: boolean;
};

export function FetchLogo({
  size = 40,
  color = 'secondary.main',
  title = 'Fetch',
  tagline = true,
}: FetchLogoProps) {
  // Bare logo (tagline=false): `size` is the rendered HEIGHT; width derives from
  // the native 1960:802 aspect ratio.
  if (!tagline) {
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
  }

  // Cluster (default): the logo fills the SAME WIDTH as the tagline line — the
  // tagline (nowrap) sets the cluster width, and the logo stretches to it with
  // height auto (aspect preserved). `size` does not drive the cluster width.
  return (
    <Stack spacing={1} sx={{ alignItems: 'stretch', width: 'fit-content' }}>
      <Image
        src="/images/fetch-logo.png"
        alt={title}
        width={1960}
        height={802}
        style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'fill', color }}
        priority
      />
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
}

export default FetchLogo;
