import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ThemeRegistry from '@/theme/ThemeRegistry';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Fetch Gateway',
  description: 'Connect your payroll provider to Plantegrity.',
};

// Server Component root layout.
//
// MUI's provider tree (AppRouterCacheProvider + ThemeProvider + CssBaseline)
// lives inside <ThemeRegistry>, which is a Client Component — see
// src/theme/ThemeRegistry.tsx for rationale. Inter font CSS variable is
// applied here so SSR ships --font-inter on the <html> element.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
