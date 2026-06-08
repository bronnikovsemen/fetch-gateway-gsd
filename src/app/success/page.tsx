'use client';

import { useRouter } from 'next/navigation';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import FlowLayout from '@/components/FlowLayout';
import FetchLogo from '@/components/FetchLogo';
import Button from '@/components/Button';

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
        <FetchLogo size={64} />
        <CheckCircleRounded sx={{ color: 'success.main', fontSize: 56 }} />
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
