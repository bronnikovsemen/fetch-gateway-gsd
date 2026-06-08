'use client';

import TextField from '@mui/material/TextField';
import { tokens } from '@/theme/theme';

// Input — Figma node 378:141. A thin wrapper over MUI's outlined size-small
// TextField (its native floating-label notch matches Figma). Focus overrides
// MUI's default purple to navy (secondary.main); the `error` prop passes
// straight through so MUI renders the native error outline + label from
// error.main. Single size only — no md/lg variants (per spec). All colors/radius
// flow through theme keys + DS tokens; no raw hex / px.

export type InputProps = {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  fullWidth?: boolean;
};

export function Input({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  error = false,
  helperText,
  disabled = false,
  fullWidth = true,
}: InputProps) {
  return (
    <TextField
      variant="outlined"
      size="small"
      label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      error={error}
      helperText={helperText}
      disabled={disabled}
      fullWidth={fullWidth}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: tokens.radius.md / tokens.radius.lg,
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: 'divider',
        },
        '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: 'secondary.main',
          borderWidth: 2,
        },
        '& .MuiInputLabel-root': {
          color: 'text.disabled',
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: 'secondary.main',
        },
      }}
    />
  );
}

export default Input;
