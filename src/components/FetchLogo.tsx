// FetchLogo — inline SVG placeholder for the Fetch wordmark.
//
// PLACEHOLDER NOTICE
// ------------------
// The artwork below is intentionally a stylized placeholder mark — a rounded
// square in brand-blue (#2463EC) containing a white "F". When the user
// provides the real Fetch wordmark artwork, swap the SVG body for it. The
// public API of this component (named export `FetchLogo`, props `size` /
// `color` / `title`, accessible role="img" + aria-label) must stay stable so
// no consumer needs to change.
//
// Why an inline SVG and not @mui/icons-material or an <img>:
//   - CLAUDE.md and Main_Fetch_Gateway.md "What NOT to do" forbid using
//     @mui/icons-material as a logo substitute.
//   - An <img src="..."> would point at an asset that does not yet exist and
//     would render broken until artwork ships.
// Inline SVG lets us ship a recognizable placeholder TODAY, theme it via the
// `color` prop, and keep the swap-in trivial later.

export type FetchLogoProps = {
  size?: number;
  color?: string;
  title?: string;
};

export function FetchLogo({
  size = 100,
  color = '#2463EC',
  title = 'Fetch',
}: FetchLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <rect x="0" y="0" width="100" height="100" rx="20" ry="20" fill={color} />
      <text
        x="50"
        y="50"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--font-inter), system-ui, sans-serif"
        fontSize="60"
        fontWeight="700"
        fill="#FFFFFF"
      >
        F
      </text>
    </svg>
  );
}

export default FetchLogo;
