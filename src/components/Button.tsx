'use client';

import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import MuiButton from '@mui/material/Button';
import type { ButtonProps as MuiButtonProps } from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

type ButtonVariant = 'primary' | 'secondary';
type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = Omit<MuiButtonProps, 'variant' | 'startIcon' | 'size'> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  iconStart?: ReactNode;
};

const SIZE_STYLES: Record<ButtonSize, { minHeight: number; px: string; py: string; fontSize: number }> = {
  sm: { minHeight: 32, px: '16px', py: '4px', fontSize: 13 },
  md: { minHeight: 40, px: '24px', py: '8px', fontSize: 14 },
  lg: { minHeight: 48, px: '32px', py: '12px', fontSize: 16 },
};

const VARIANT_STYLES = {
  primary: {
    bgcolor: '#005EFF',
    color: '#FFFFFF',
    '&:hover': { bgcolor: '#004ACC' },
    '&.Mui-disabled': { bgcolor: '#005EFF', color: '#FFFFFF', opacity: 0.3 },
  },
  secondary: {
    bgcolor: '#F3FCFF',
    color: '#001639',
    '&:hover': { bgcolor: '#E5F4FE' },
    '&.Mui-disabled': { color: '#001639', opacity: 0.5 },
  },
} as const;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading = false, iconStart, disabled, sx, children, ...rest },
  ref,
) {
  const start = loading ? <CircularProgress size={18} color="inherit" /> : iconStart;

  return (
    <MuiButton
      ref={ref}
      disableElevation
      variant={variant === 'primary' ? 'contained' : 'text'}
      disabled={disabled || loading}
      startIcon={start}
      sx={[
        {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: '8px',
          ...SIZE_STYLES[size],
          ...VARIANT_STYLES[variant],
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...rest}
    >
      {children}
    </MuiButton>
  );
});

export default Button;
