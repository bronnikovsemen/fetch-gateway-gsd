// FetchLogo — Fetch wordmark (arrows + FETCH text) from the Phase 1 Figma file.
//
// Public API is preserved from the previous placeholder so consumers don't change:
//   named export `FetchLogo`, props `size` / `color` / `title`.
// `size` controls the rendered HEIGHT in px; width is derived from the artwork's
// native 66:64 aspect ratio. `color` is intentionally unused now that the logo is
// a multi-color raster — kept in the type so existing call sites compile.

export type FetchLogoProps = {
  size?: number;
  color?: string;
  title?: string;
};

export function FetchLogo({
  size = 100,
  title = 'Fetch',
}: FetchLogoProps) {
  const width = Math.round(size * (66 / 64));
  return (
    <img
      src="/images/fetch-logo.png"
      alt={title}
      width={width}
      height={size}
      style={{ width, height: size, display: 'block', objectFit: 'contain' }}
    />
  );
}

export default FetchLogo;
