'use client';

import { useRouter } from 'next/navigation';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FlowLayout from '@/components/FlowLayout';
import FetchLogo from '@/components/FetchLogo';

// `/welcome` — first real screen of the Pre-Provider Flow (FLOW-02).
// 440px white panel on the Fetch page background with 48px uniform padding
// (delivered via FlowLayout's px/py API from Plan 02-01 — this is its first
// real consumer). Fetch logo at 100px, the spec heading, the spec body copy,
// and a primary brand-blue Get Started button that imperatively navigates to
// `/permissions` via Next.js's App Router. `useRouter` requires the file to
// be a Client Component, hence `'use client'`.

export default function Page() {
  const router = useRouter();

  return (
    <FlowLayout maxWidth={440} px={6} py={6}>
      <Stack spacing={3} sx={{ alignItems: 'center' }}>
        <FetchLogo size={100} />
        <Typography
          variant="h5"
          component="h1"
          sx={{ fontWeight: 700, color: 'text.primary', textAlign: 'center' }}
        >
          Connect your payroll provider
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: 'text.secondary', textAlign: 'center' }}
        >
          Plantegrity has requested a secure read-only connection to your payroll data for plan validation and reconciliation. No data will be modified.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => router.push('/permissions')}
          sx={{ mt: 2, alignSelf: 'stretch', textTransform: 'none', fontWeight: 600 }}
        >Get Started</Button>
      </Stack>
    </FlowLayout>
  );
}
