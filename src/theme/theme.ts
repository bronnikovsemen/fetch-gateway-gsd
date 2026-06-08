import { createTheme } from '@mui/material/styles';

// Fetch Gateway design-token theme.
//
// Source of truth: Figma "Fetch Design System" (file key pZYTXYGKR5lJAcaE0SnzLV).
// This file is the SINGLE source of truth for every design token in src/ —
// the only file allowed to hold raw color + spacing primitives. Every value
// below is taken verbatim from the design system; no substitutions, no
// invented shades. Consumers MUST reference these via MUI palette/typography
// keys, theme.spacing(), or the exported `tokens` object below.
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      // Brand Accent — DS buttons, links, and interactive accents are purple.
      main: '#635bff',
      contrastText: '#ffffff',
    },
    secondary: {
      // Brand Primary — navy ink.
      main: '#0a2540',
      contrastText: '#ffffff',
    },
    background: {
      default: '#fafafa', // Background Page
      paper: '#ffffff', // Background Surface
    },
    divider: '#e2e8f0', // Border Default
    text: {
      primary: '#020810', // Text Primary
      secondary: '#475569', // Text Secondary
      disabled: '#64748b', // Text Muted
    },
    success: {
      main: '#22c55e',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#f59e0b',
    },
    error: {
      // Rejection
      main: '#ef4444',
      contrastText: '#ffffff',
    },
    info: {
      // Info Text
      main: '#4338ca',
      contrastText: '#ffffff',
    },
  },
  typography: {
    // Inter is loaded by app/layout.tsx via next/font/google as --font-inter.
    // Falls back to system-ui if the variable is missing (e.g. during dev).
    fontFamily: 'var(--font-inter), system-ui, sans-serif',
    h4: { fontWeight: 600, fontSize: 28, lineHeight: 36 / 28 },
    h5: { fontWeight: 600, fontSize: 22, lineHeight: 32 / 22 },
    subtitle1: { fontWeight: 600, fontSize: 16, lineHeight: 24 / 16 },
    body1: { fontWeight: 400, fontSize: 16, lineHeight: 24 / 16 },
    body2: { fontWeight: 400, fontSize: 14, lineHeight: 20 / 14 },
    button: { fontWeight: 600, fontSize: 14, lineHeight: 20 / 14, textTransform: 'none' },
    caption: { fontWeight: 400, fontSize: 12, lineHeight: 16 / 12 },
    overline: { fontWeight: 600, fontSize: 11, lineHeight: 16 / 11, textTransform: 'uppercase' },
  },
  shape: {
    // radius.lg — DS panel/control radius; centralized here.
    borderRadius: 12,
  },
});

// Design-system primitives that MUI's palette/typography do not express
// directly. Consumers import this object for radius + spacing primitives and
// for the four DS text styles that have no 1:1 MUI variant.
export const tokens = {
  radius: { xs: 4, sm: 6, md: 8, lg: 12, xl: 16, full: 9999 },
  space: [4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96],
  text: {
    body2Medium: { fontWeight: 500, fontSize: 14, lineHeight: 20 / 14 },
    chip: { fontWeight: 500, fontSize: 13, lineHeight: 20 / 13 },
    sectionLabel: { fontWeight: 600, fontSize: 12, lineHeight: 16 / 12 },
    code: { fontWeight: 400, fontSize: 13, lineHeight: 20 / 13 },
  },
} as const;

export default theme;
