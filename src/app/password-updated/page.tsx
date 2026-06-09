'use client';

import { useRouter } from 'next/navigation';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FlowLayout from '@/components/FlowLayout';
import FetchLogo from '@/components/FetchLogo';
import Button from '@/components/Button';

// `/password-updated` — AUTH-03 (Figma 474:273). Terminal step of password
// recovery. FIGMA DIVERGENCE: the task originally asked for a rounded check-circle
// success mark, but Figma shows NO checkmark icon — instead the "Password
// updated" title is rendered in success green (success.main). Per "Figma is
// authoritative," we follow Figma: green title, no icon import. Flagged in SUMMARY.
export default function Page() {
  const router = useRouter();

  return (
    <FlowLayout maxWidth={400} px={4} py={4}>
      <Stack spacing={3} sx={{ alignItems: 'center' }}>
        <FetchLogo size={40} />
        <Typography variant="h5" component="h1" sx={{ color: 'success.main', textAlign: 'center' }}>
          Password updated
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
          You can now sign in with your new password.
        </Typography>

        <Button variant="primary" sx={{ width: '100%' }} onClick={() => router.push('/sign-in')}>
          Continue to sign in
        </Button>
      </Stack>
    </FlowLayout>
  );
}
