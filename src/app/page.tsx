'use client';

import { useRouter } from 'next/navigation';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FlowLayout from '@/components/FlowLayout';
import FetchLogo from '@/components/FetchLogo';
import OptionRow from '@/components/OptionRow';

// `/` — Demo home launcher (DEMO-01).
//
// Repurposes the old splash screen into the demo hub. There is NO auto-redirect
// and NO breathing/scale-in animation anymore: `/` now renders a Fetch-branded
// launcher and stays put. From here the user picks one of three demo flows; the
// rest of the app (`/success` "Continue", join/create-org "Create…") returns
// here, so this is the canonical signed-in landing for the demo.
//
// All chrome flows through DS components + theme/tokens — no off-token hex/px.

export default function Page() {
  const router = useRouter();

  return (
    <FlowLayout maxWidth={440} px={4} py={4}>
      <Stack spacing={3}>
        <Stack spacing={2} sx={{ alignItems: 'center', textAlign: 'center' }}>
          <FetchLogo />
          <Typography variant="h5" component="h1" sx={{ color: 'text.primary' }}>
            Fetch demo
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Pick a flow to run through the demo.
          </Typography>
        </Stack>

        <Stack spacing={2}>
          <OptionRow
            title="Sign up — join an existing organization"
            description="Your work domain already has a Fetch org"
            onClick={() => router.push('/sign-up?org=existing')}
          />
          <OptionRow
            title="Sign up — create a new organization"
            description="Set up a brand-new Fetch organization"
            onClick={() => router.push('/sign-up')}
          />
          <OptionRow
            title="Connection flow"
            description="Connect a payroll system — Gusto, Principal, or SFTP"
            onClick={() => router.push('/welcome')}
          />
        </Stack>
      </Stack>
    </FlowLayout>
  );
}
