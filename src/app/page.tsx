'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { keyframes } from '@emotion/react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FetchLogo from '@/components/FetchLogo';

// Splash screen at `/` (FLOW-01).
//
// Sits directly on the themed page background (the brand sky-blue via the MUI
// theme token `background.default`) — NOT inside the shared panel chrome —
// because the spec's `### / — Splash` section says the splash has no white
// panel (unlike every other route in the flow). The Fetch logo plays a 500ms
// scale-in animation, then enters a continuous 2s breathing pulse, while a
// useEffect-driven setTimeout auto-redirects to `/welcome` after 2500ms via
// Next.js client-side routing. The timer is cleared on unmount so a fast
// navigation away doesn't leak a stale push.
//
// Keyframes are declared at module scope so React doesn't recreate them on
// every render — Emotion can cache the serialized animation name across mounts.

const scaleIn = keyframes`
  from {
    transform: scale(0.6);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`;

const breathe = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.04);
  }
  100% {
    transform: scale(1);
  }
`;

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => { router.push('/welcome'); }, 2500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Stack spacing={3} sx={{ alignItems: 'center' }}>
        <Box
          sx={{
            animation: `${scaleIn} 500ms ease-out, ${breathe} 2s ease-in-out 500ms infinite`,
          }}
        >
          <FetchLogo size={56} />
        </Box>
        <Typography
          variant="h6"
          sx={{ color: 'text.primary', fontWeight: 500 }}
        >
          Retirement runs on Fetch
        </Typography>
      </Stack>
    </Box>
  );
}
