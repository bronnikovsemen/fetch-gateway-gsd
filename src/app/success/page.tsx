'use client';

import { useRouter } from 'next/navigation';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import FlowLayout from '@/components/FlowLayout';
import FetchLogo from '@/components/FetchLogo';

// `/success` — final screen of the Pre-Provider Flow (FLOW-08). The closer of
// the five-step demo flow: a centered white panel on the Fetch page background
// with the Fetch logo, a green checkmark icon (sourced via the MUI success
// token, not a raw hex literal), the spec heading, short confirmation body
// copy, and a primary brand-blue Done button that imperatively navigates back
// to `/` to close the demo loop. `useRouter` requires the file to be a Client
// Component, hence `'use client'` on line 1. The checkmark glyph comes from
// @mui/icons-material (CheckCircleRounded) — the locked icon library for
// in-content iconography. FetchLogo is the only icon-library exception (it is
// an inline-SVG brand mark, not an icon).

export default function Page() {
  const router = useRouter();

  return (
    <FlowLayout maxWidth={440}>
      <Stack spacing={3} sx={{ alignItems: 'center' }}>
        <FetchLogo size={100} />
        <CheckCircleRoundedIcon sx={{ fontSize: 64, color: 'success.main' }} />
        <Typography
          variant="h5"
          component="h1"
          sx={{ fontWeight: 700, color: 'text.primary', textAlign: 'center' }}
        >
          Connected successfully
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: 'text.secondary', textAlign: 'center' }}
        >
          Your payroll connection is ready. You can now close this window or return to start.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => router.push('/')}
          sx={{ textTransform: 'none', fontWeight: 600, alignSelf: 'stretch', mt: 2 }}
        >Done</Button>
      </Stack>
    </FlowLayout>
  );
}
