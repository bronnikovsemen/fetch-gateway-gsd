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
//   - `size`    — HEIGHT in px of the logo image; width derives from the native
//                 1960:802 aspect ratio (~2.44:1 lockup). Default suits a card
//                 header; splash/connecting heroes pass a larger height.
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
  const width = Math.round(size * (1960 / 802));
  const logo = (
    <Image
      src="/images/fetch-logo.png"
      alt={title}
      width={width}
      height={size}
      style={{ width, height: size, display: 'block', objectFit: 'contain', color }}
      priority
    />
  );

  if (!tagline) {
    return logo;
  }

  return (
    <Stack spacing={1} sx={{ alignItems: 'center' }}>
      {logo}
      <Typography
        component="p"
        sx={{
          ...tokens.text.sectionLabel,
          color: 'text.disabled',
          letterSpacing: '0.08em',
          whiteSpace: 'nowrap',
        }}
      >
        CONNECT · SYNC · SIMPLIFY
      </Typography>
    </Stack>
  );
}

export default FetchLogo;
