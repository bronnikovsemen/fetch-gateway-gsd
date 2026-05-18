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
//
// Padding API: `px` and `py` accept MUI theme-spacing units (MUI default of
// 8px/unit applies). Defaults are `px={6}` and `py={6}` = 48px uniform padding,
// matching the spec's /welcome panel and preserving Phase 1's visual baseline.
// `/permissions` passes `px={4.5} py={6}` for the spec-mandated 36px-horizontal
// / 48px-vertical split without an `sx` override at the call site.
// Switching to theme-spacing units (away from the previous raw-px string
// interpolation) closes Phase 1 REVIEW findings WR-01 + WR-02.

export type FlowLayoutProps = {
  children: ReactNode;
  maxWidth?: number;
  px?: number;
  py?: number;
};

export function FlowLayout({
  children,
  maxWidth = 440,
  px = 6,
  py = 6,
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
          px,
          py,
        }}
      >
        {children}
      </Paper>
    </Box>
  );
}

export default FlowLayout;
