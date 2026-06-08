'use client';

import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import MuiButton from '@mui/material/Button';
import type { ButtonProps as MuiButtonProps } from '@mui/material/Button';
import type { Theme } from '@mui/material/styles';
import type { SxProps } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import { tokens } from '@/theme/theme';

type ButtonVariant = 'primary' | 'secondary';
type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = Omit<MuiButtonProps, 'variant' | 'startIcon' | 'size'> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  iconStart?: ReactNode;
};

// Per-size padding sourced from the DS spacing scale (tokens.space, px units)
// and minHeight from the DS control sizing. All padding flows through the theme
// via tokens — no raw px string literals.
const SIZE_STYLES: Record<ButtonSize, { minHeight: number; px: number; py: number; fontSize: number }> = {
  sm: { minHeight: 32, px: tokens.space[3], py: tokens.space[0], fontSize: 13 },
  md: { minHeight: 40, px: tokens.space[5], py: tokens.space[1], fontSize: 14 },
  lg: { minHeight: 48, px: tokens.space[6], py: tokens.space[2], fontSize: 16 },
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading = false, iconStart, disabled, sx, children, ...rest },
  ref,
) {
  const start = loading ? <CircularProgress size={18} color="inherit" /> : iconStart;
  const dims = SIZE_STYLES[size];

  // primary → contained, driven by palette.primary (DS purple); MUI derives the
  // hover/disabled shades from the theme palette.
  // secondary → text/tonal, driven by palette.secondary (DS navy ink).
  const variantSx: SxProps<Theme> =
    variant === 'primary'
      ? {
          '&.Mui-disabled': { bgcolor: 'primary.main', color: 'primary.contrastText', opacity: 0.3 },
        }
      : {
          color: 'secondary.main',
          bgcolor: 'action.hover',
          '&:hover': { bgcolor: 'action.selected' },
          '&.Mui-disabled': { color: 'secondary.main', opacity: 0.5 },
        };

  return (
    <MuiButton
      ref={ref}
      disableElevation
      color={variant === 'primary' ? 'primary' : 'secondary'}
      variant={variant === 'primary' ? 'contained' : 'text'}
      disabled={disabled || loading}
      startIcon={start}
      sx={[
        {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: tokens.radius.md / tokens.radius.lg,
          minHeight: dims.minHeight,
          fontSize: dims.fontSize,
          px: dims.px / 8,
          py: dims.py / 8,
        },
        variantSx,
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...rest}
    >
      {children}
    </MuiButton>
  );
});

export default Button;
