import Box from '@mui/material/Box';
import { tokens } from '@/theme/theme';

// Chip — Figma node 326:110. A filled status pill across 5 severities × 2 sizes.
// Geometry is a rounded RECTANGLE (radius.sm/md, py 2/4) per Figma — NOT a pill.
// Each severity's fg/bg is read uniformly through tokens.status[severity]; no
// color is inlined. Presentational only — no 'use client'.

type ChipSeverity = 'warning' | 'success' | 'rejection' | 'info' | 'neutral';
type ChipSize = 'small' | 'medium';

export type ChipProps = {
  label: string;
  severity: ChipSeverity;
  size?: ChipSize;
};

const SIZE_STYLES: Record<ChipSize, { px: number; py: number; borderRadius: number }> = {
  small: { px: 1, py: 0.25, borderRadius: tokens.radius.sm },
  medium: { px: 1.5, py: 0.5, borderRadius: tokens.radius.md },
};

export function Chip({ label, severity, size = 'small' }: ChipProps) {
  const dims = SIZE_STYLES[size];
  const palette = tokens.status[severity];

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: palette.bg,
        color: palette.fg,
        px: dims.px,
        py: dims.py,
        borderRadius: dims.borderRadius / tokens.radius.lg,
        ...tokens.text.chip,
      }}
    >
      {label}
    </Box>
  );
}

export default Chip;
