'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FlowLayout from '@/components/FlowLayout';
import FetchLogo from '@/components/FetchLogo';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Link from '@/components/Link';

// `/sign-in` — AUTH-01 (Figma 459:145). Plain 'use client' page (no query param).
// Mocked auth: "Sign in" navigates to `/` (the splash stands in for the app
// landing per spec). "Forgot password?" → /forgot-password; "Sign up" → /sign-up.
export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <FlowLayout maxWidth={400} px={4} py={4}>
      <Stack spacing={3} sx={{ alignItems: 'center' }}>
        <FetchLogo size={40} />
        <Typography variant="h5" component="h1" sx={{ color: 'text.primary', textAlign: 'center' }}>
          Sign in to Fetch
        </Typography>

        <Input
          label="Email"
          placeholder="you@acme.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
          <Link size="sm" onClick={() => router.push('/forgot-password')}>
            Forgot password?
          </Link>
        </Box>

        <Button variant="primary" sx={{ width: '100%' }} onClick={() => router.push('/')}>
          Sign in
        </Button>

        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Don’t have an account?
          </Typography>
          <Link size="sm" onClick={() => router.push('/sign-up')}>
            Sign up
          </Link>
        </Stack>
      </Stack>
    </FlowLayout>
  );
}
