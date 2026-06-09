'use client';

import { useRouter } from 'next/navigation';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FlowLayout from '@/components/FlowLayout';
import FetchLogo from '@/components/FetchLogo';
import Button from '@/components/Button';
import Link from '@/components/Link';

// `/check-email` — AUTH-03 (Figma 460:252). Step 2 of password recovery.
// "Back to sign in" → /sign-in; "Resend link" re-loads /check-email (a real
// action, not a dead button). The "Open the reset link (demo)" link is a task
// addition (not in Figma) that makes /set-new-password click-reachable. No inputs.
export default function Page() {
  const router = useRouter();

  return (
    <FlowLayout maxWidth={400} px={4} py={4}>
      <Stack spacing={3} sx={{ alignItems: 'center' }}>
        <FetchLogo size={40} />
        <Typography variant="h5" component="h1" sx={{ color: 'text.primary', textAlign: 'center' }}>
          Check your email
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
          We sent a reset link to you@acme.com. It expires in 30 minutes.
        </Typography>

        <Button variant="primary" sx={{ width: '100%' }} onClick={() => router.push('/sign-in')}>
          Back to sign in
        </Button>

        <Link size="sm" onClick={() => router.push('/check-email')}>
          Resend link
        </Link>
        <Link size="sm" onClick={() => router.push('/set-new-password')}>
          Open the reset link (demo)
        </Link>
      </Stack>
    </FlowLayout>
  );
}
