'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FlowLayout from '@/components/FlowLayout';
import FetchLogo from '@/components/FetchLogo';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Link from '@/components/Link';

// `/forgot-password` — AUTH-03 (Figma 460:232). Step 1 of password recovery.
// Mocked: "Send reset link" navigates to /check-email; "Back to sign in" → /sign-in.
export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  return (
    <FlowLayout maxWidth={400} px={4} py={4}>
      <Stack spacing={3} sx={{ alignItems: 'center' }}>
        <FetchLogo size={40} />
        <Typography variant="h5" component="h1" sx={{ color: 'text.primary', textAlign: 'center' }}>
          Reset your password
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
          Enter your email and we’ll send you a reset link.
        </Typography>

        <Input
          label="Email"
          placeholder="you@acme.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button variant="primary" sx={{ width: '100%' }} onClick={() => router.push('/check-email')}>
          Send reset link
        </Button>

        <Link size="sm" onClick={() => router.push('/sign-in')}>
          Back to sign in
        </Link>
      </Stack>
    </FlowLayout>
  );
}
