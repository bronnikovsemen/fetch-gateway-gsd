import Image from 'next/image';

// FetchLogo — Fetch horizontal lockup (blue gradient arrows mark + "Fetch"
// wordmark) from the Plantegrity Phase-1 Figma file (node 1964:177).
//
// Public API is preserved so consumers don't change:
//   named export `FetchLogo`, props `size` / `color` / `title`.
// `size` controls the rendered HEIGHT in px; width is derived from the artwork's
// native 1960:802 aspect ratio (a wide ~2.44:1 lockup). Default height suits a
// card header; the splash/connecting heroes pass a larger height.
//
// `color` defaults to a theme palette-token reference ('secondary.main' — the
// DS navy ink) rather than a literal hex. The current logo is a multi-color
// raster so the tint is applied via the CSS `color` channel (forward-proofing
// for an inline-SVG swap that reads `currentColor`); the raster itself is not
// recolored. The hard contract: zero hardcoded color values in this file, and
// the default flows from the theme, not a literal.

export type FetchLogoProps = {
  size?: number;
  color?: string;
  title?: string;
};

export function FetchLogo({
  size = 40,
  color = 'secondary.main',
  title = 'Fetch',
}: FetchLogoProps) {
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

export default FetchLogo;
