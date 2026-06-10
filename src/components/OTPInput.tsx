'use client';

import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { tokens } from '@/theme/theme';

// OTPInput — Figma node 448:64. The one-time-code field, extracted verbatim from
// /verify (commit 10c67fb) so the provider 2FA gate and the email-ownership step
// share a single implementation.
//
// No DS OTP primitive exists in MUI, so the field is assembled from token-styled
// Box cells plus a single visually-hidden native capture input
// (Box component="input") overlaying the row — a legitimate raw-MUI exception.
// The capture input is auto-focused on mount (unless `autoFocus={false}`) so
// digits register immediately, and it drives an "active cell" highlight: a 2px
// Brand Accent (primary.main) border on the next empty slot (clamped to the last
// index) that shows ONLY while the input holds focus; on blur every cell reverts
// to the 1px divider border. Entry is filtered to digits and clamped to
// `cellCount`; the filtered string is reported up through `onChange`.

export type OTPInputProps = {
  value: string;
  onChange: (code: string) => void;
  cellCount?: number;
  autoFocus?: boolean;
};

export function OTPInput({ value, onChange, cellCount = 6, autoFocus = true }: OTPInputProps) {
  // The hidden capture input drives the "active cell" highlight: a cell is only
  // shown active while the input actually holds focus (onFocus/onBlur). When
  // blurred, every cell falls back to the 1px divider border.
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus the capture input on mount so digits register immediately,
  // without the user having to click a cell first.
  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  // Active cell = next empty slot, clamped to the final index once full.
  const activeIndex = Math.min(value.length, cellCount - 1);

  return (
    <Box sx={{ position: 'relative' }}>
      <Stack direction="row" spacing={1} sx={{ justifyContent: 'center' }}>
        {Array.from({ length: cellCount }).map((_, i) => {
          // The active highlight only shows while the capture input is
          // focused; on blur every cell reverts to the 1px divider border.
          const isActive = isFocused && i === activeIndex;
          const isFilled = i < value.length;
          return (
            <Box
              key={i}
              sx={{
                width: 48,
                height: 56,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                // Active & empty cells use the paper surface; filled non-active
                // cells use the slightly-tinted default background.
                bgcolor: isActive
                  ? 'background.paper'
                  : isFilled
                    ? 'background.default'
                    : 'background.paper',
                // MUI multiplies a numeric borderRadius by shape.borderRadius
                // (= tokens.radius.lg); this ratio yields exactly radius.md px.
                borderRadius: tokens.radius.md / tokens.radius.lg,
                border: isActive ? '2px solid' : '1px solid',
                borderColor: isActive ? 'primary.main' : 'divider',
              }}
            >
              <Typography variant="h5" sx={{ color: 'text.primary' }}>
                {value[i] ?? ''}
              </Typography>
            </Box>
          );
        })}
      </Stack>
      <Box
        component="input"
        ref={inputRef}
        inputMode="numeric"
        maxLength={cellCount}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value.replace(/\D/g, '').slice(0, cellCount))
        }
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0,
          cursor: 'text',
          border: 'none',
          padding: 0,
          margin: 0,
          background: 'transparent',
        }}
      />
    </Box>
  );
}

export default OTPInput;
