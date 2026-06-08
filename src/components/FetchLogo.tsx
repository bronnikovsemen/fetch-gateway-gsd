import Image from 'next/image';

// FetchLogo — Fetch wordmark (arrows + FETCH text) from the Phase 1 Figma file.
//
// Public API is preserved from the previous placeholder so consumers don't change:
//   named export `FetchLogo`, props `size` / `color` / `title`.
// `size` controls the rendered HEIGHT in px; width is derived from the artwork's
// native 66:64 aspect ratio.
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
  size = 100,
  color = 'secondary.main',
  title = 'Fetch',
}: FetchLogoProps) {
  const width = Math.round(size * (66 / 64));
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
