'use client';

// Client-side MUI provider tree.
//
// MUI v9's ThemeProvider is a Client Component. Passing a `theme` prop
// (which contains functions like `paletteTransform`) directly from a
// Server Component to a Client Component throws because Next.js cannot
// serialize functions across the RSC boundary. The canonical fix is to
// import the theme INSIDE this client module — keeping the whole MUI
// provider chain on the client side of the boundary — and have the
// Server Component layout render <ThemeRegistry>{children}</ThemeRegistry>.
//
// References:
// - https://mui.com/material-ui/integrations/nextjs/ (App Router section)
// - Bug surfaced in Plan 01-01, Task 3 smoke test (Rule 1 deviation).

import * as React from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme/theme';

export default function ThemeRegistry({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
