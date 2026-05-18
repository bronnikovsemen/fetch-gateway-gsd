import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

// FlowLayout — the centered white Paper on the Fetch page background that
// every Fetch-branded screen shares (welcome, permissions, select-provider,
// connecting, success). The outer Box owns the page background and centering;
// the inner Paper owns the panel chrome (12px radius, soft shadow).
//
// Layout tokens consumed from the MUI theme:
//   - bgcolor='background.default' → '#EBF5FF' (Fetch page background)
//   - bgcolor='background.paper'   → '#FFFFFF' (panel surface)
// Brand-mandated layout values (intentionally hardcoded — they ARE the spec):
//   - borderRadius: '12px'                       (UI-01 panel radius)
//   - boxShadow:    '0 2px 8px rgba(0,0,0,0.08)' (UI-01 soft elevation)
//
// `maxWidth` defaults to 440px (welcome-screen sizing per the spec). Phase 2-3
// consumers override: 768 for /permissions, 498 for /select-provider.

export type FlowLayoutProps = {
  children: ReactNode;
  maxWidth?: number;
  padding?: number;
};

export function FlowLayout({
  children,
  maxWidth = 440,
  padding = 48,
}: FlowLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          backgroundColor: 'background.paper',
          width: '100%',
          maxWidth,
          p: `${padding}px`,
        }}
      >
        {children}
      </Paper>
    </Box>
  );
}

export default FlowLayout;
