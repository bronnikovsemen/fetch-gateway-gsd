import { createTheme } from '@mui/material/styles';

// Fetch Gateway brand-token theme.
//
// Source of truth: Main_Fetch_Gateway.md "Design tokens" section.
// Every hex below is verbatim from the spec — no substitutions.
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2463EC', // Fetch blue — buttons, links, icons
    },
    background: {
      default: '#EBF5FF', // Page background — all Fetch-branded screens
      paper: '#FFFFFF', // Panel surface
    },
    text: {
      primary: '#101827',
      secondary: '#6B7280',
    },
    divider: '#E5E7EB',
    success: {
      main: '#10B981',
    },
    warning: {
      main: '#F59E0B',
    },
    error: {
      main: '#EF4444',
    },
  },
  typography: {
    // Inter is loaded by app/layout.tsx via next/font/google as --font-inter.
    // Falls back to system-ui if the variable is missing (e.g. during dev).
    fontFamily: 'var(--font-inter), system-ui, sans-serif',
  },
  shape: {
    // 12px panel radius required by UI-01 onward; centralized here.
    borderRadius: 12,
  },
});

export default theme;
