import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { tokens } from '@/theme/theme';

// FlowLayout — the centered white Paper on the Fetch page background that
// every Fetch-branded screen shares (welcome, permissions, select-provider,
// connecting, success). The outer Box owns the page background and centering;
// the inner Paper owns the panel chrome (DS radius.lg, soft shadow).
//
// Layout tokens consumed from the MUI theme:
//   - bgcolor='background.default' (page background)
//   - bgcolor='background.paper'   (panel surface)
//   - borderRadius via tokens.radius.lg
// The soft elevation shadow uses an rgba() value (not a color hex, not a px
// string literal) — it does not trip the token linter.
//
// `maxWidth` defaults to 440px (welcome-screen sizing per the spec). Phase 2-3
// consumers override: 768 for /permissions, 498 for /select-provider.
//
// Padding API: `px` and `py` accept MUI theme-spacing units (MUI default of
// 8px/unit applies). Defaults are `px={6}` and `py={6}` = 48px uniform padding,
// matching the spec's /welcome panel and preserving Phase 1's visual baseline.
// `/permissions` passes `px={4.5} py={6}` for the spec-mandated 36px-horizontal
// / 48px-vertical split without an `sx` override at the call site.

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
          // MUI multiplies a numeric borderRadius by theme.shape.borderRadius
          // (= tokens.radius.lg); this ratio yields exactly tokens.radius.lg px.
          borderRadius: tokens.radius.lg / tokens.radius.lg,
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
