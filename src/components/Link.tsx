'use client';

import type { ReactNode } from 'react';
import MuiLink from '@mui/material/Link';
import { tokens } from '@/theme/theme';

// Link — Figma node 338:92. A thin wrapper over MUI's Link, painted navy
// (secondary.main, "Brand Primary") with underline-on-hover. Two sizes:
//   md → body2 sizing (14/20)
//   sm → tokens.text.code (13/20)
// Weight stays 400 (carried by body2 / code — never overridden to 500). All
// colors/type flow through theme keys + DS tokens; no raw hex / px.

type LinkSize = 'sm' | 'md';

export type LinkProps = {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  size?: LinkSize;
};

export function Link({ children, onClick, href, size = 'md' }: LinkProps) {
  const typeSx =
    size === 'sm' ? { ...tokens.text.code } : { fontSize: 14, lineHeight: 20 / 14 };

  return (
    <MuiLink
      href={href}
      onClick={onClick}
      color="secondary.main"
      underline="hover"
      sx={typeSx}
    >
      {children}
    </MuiLink>
  );
}

export default Link;
