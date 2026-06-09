'use client';

import { useRouter } from 'next/navigation';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FlowLayout from '@/components/FlowLayout';
import FetchLogo from '@/components/FetchLogo';
import Button from '@/components/Button';
import Link from '@/components/Link';

// `/join-organization` — AUTH-02 (Figma 459:204). Reached from
// /sign-up?org=existing. Mocked: "Request to join" navigates to `/` (the splash
// stands in for the app landing per spec). No inputs on this screen.
export default function Page() {
  const router = useRouter();

  return (
    <FlowLayout maxWidth={400} px={4} py={4}>
      <Stack spacing={3} sx={{ alignItems: 'center' }}>
        <FetchLogo size={40} />
        <Typography variant="h5" component="h1" sx={{ color: 'text.primary', textAlign: 'center' }}>
          Join Acme Inc.
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
          An organization already exists for acme.com. Request access to join your team.
        </Typography>

        <Button variant="primary" sx={{ width: '100%' }} onClick={() => router.push('/')}>
          Request to join
        </Button>

        <Link size="sm" onClick={() => router.push('/sign-up')}>
          Use a different email
        </Link>
      </Stack>
    </FlowLayout>
  );
}
