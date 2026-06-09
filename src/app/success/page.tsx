'use client';

import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CheckRounded from '@mui/icons-material/CheckRounded';
import FlowLayout from '@/components/FlowLayout';
import FetchLogo from '@/components/FetchLogo';
import Button from '@/components/Button';
import { tokens } from '@/theme/theme';

// `/success` — v2 Stage 2 terminal screen (FLOW-08 backfill, Figma 2069:145).
//
// This route was recorded as FLOW-08 in Phase 1 but never created — it 404'd on
// disk. Both self-branch paths (Establishing → 2FA → Success, and the no-2FA
// Establishing → Success variant) land here, so Stage 2 creates it from Figma.
//
// Terminal screen: no provider param needed. The single "Continue" CTA loops the
// demo back to the splash (/), so a reviewer can re-run the flow end to end.
export default function Page() {
  const router = useRouter();

  return (
    <FlowLayout maxWidth={400} px={4} py={4}>
      <Stack spacing={2.5} sx={{ alignItems: 'center', textAlign: 'center' }}>
        <FetchLogo size={40} />
        <Box
          sx={{
            width: 56,
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'success.main',
            // MUI multiplies a numeric borderRadius by shape.borderRadius
            // (= tokens.radius.lg); radius.full / radius.lg yields a full circle.
            borderRadius: tokens.radius.full / tokens.radius.lg,
          }}
        >
          <CheckRounded sx={{ fontSize: 28, color: 'background.paper' }} />
        </Box>
        <Typography variant="h5" component="h1" sx={{ color: 'text.primary' }}>
          You’re connected
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Plantegrity is now securely syncing your organization’s data.
        </Typography>
        <Button variant="primary" sx={{ width: '100%' }} onClick={() => router.push('/')}>
          Continue
        </Button>
      </Stack>
    </FlowLayout>
  );
}
