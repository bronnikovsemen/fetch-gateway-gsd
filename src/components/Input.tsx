'use client';

import TextField from '@mui/material/TextField';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { tokens } from '@/theme/theme';

// Input — Figma node 378:141. A thin wrapper over MUI's outlined size-small
// TextField (its native floating-label notch matches Figma). Focus uses the DS
// Brand Accent (primary.main) for the outline + floating label — the DS updated
// the focused input stroke from navy to accent. The `error` prop
// passes straight through so MUI renders the native error outline + label from
// error.main. Single size only — no md/lg variants (per spec). All colors/radius
// flow through theme keys + DS tokens; no raw hex / px.

export type InputProps = {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  placeholder?: string;
  type?: string;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  // Select mode: when true, the TextField renders as a dropdown whose options
  // are the passed `children` (<MenuItem>s), with a chevron-down trailing icon.
  // Backward-compatible — default false keeps the plain outlined text input.
  select?: boolean;
  children?: React.ReactNode;
};

export function Input({
  label,
  value,
  onChange,
  onKeyDown,
  placeholder,
  type = 'text',
  error = false,
  helperText,
  disabled = false,
  fullWidth = true,
  select = false,
  children,
}: InputProps) {
  return (
    <TextField
      variant="outlined"
      size="small"
      label={label}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      type={type}
      error={error}
      helperText={helperText}
      disabled={disabled}
      fullWidth={fullWidth}
      select={select}
      slotProps={select ? { select: { IconComponent: KeyboardArrowDownIcon } } : undefined}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: tokens.radius.md / tokens.radius.lg,
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: 'divider',
        },
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: 'primary.main',
          borderWidth: 2,
        },
        '& .MuiInputLabel-root': {
          color: 'text.disabled',
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: 'primary.main',
        },
      }}
    >
      {children}
    </TextField>
  );
}

export default Input;
