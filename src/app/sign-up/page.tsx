'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FlowLayout from '@/components/FlowLayout';
import FetchLogo from '@/components/FetchLogo';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Link from '@/components/Link';

// `/sign-up` — AUTH-01 (Figma 459:174). The only auth route that reads a query
// param, so it mirrors /connect-method's Suspense + useSearchParams shape: a
// default-exported Page() wraps SignUpContent in <Suspense> so the route still
// pre-renders while the param-reading subtree streams on the client.
//
// "Create account" branches on the demo flag:
//   • /sign-up               → /create-organization  (no existing org)
//   • /sign-up?org=existing  → /join-organization     (org already exists)

function SignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const org = searchParams.get('org');

  const [workEmail, setWorkEmail] = useState('');
  const [invitationCode, setInvitationCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <FlowLayout maxWidth={400} px={4} py={4}>
      <Stack spacing={3} sx={{ alignItems: 'center' }}>
        <FetchLogo size={40} />
        <Typography variant="h5" component="h1" sx={{ color: 'text.primary', textAlign: 'center' }}>
          Create your account
        </Typography>

        <Input
          label="Work email"
          placeholder="you@acme.com"
          value={workEmail}
          onChange={(e) => setWorkEmail(e.target.value)}
        />
        <Input
          label="Invitation code"
          value={invitationCode}
          onChange={(e) => setInvitationCode(e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          label="Confirm password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Button
          variant="primary"
          sx={{ width: '100%' }}
          onClick={() =>
            router.push(org === 'existing' ? '/join-organization' : '/create-organization')
          }
        >
          Create account
        </Button>

        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Already have an account?
          </Typography>
          <Link size="sm" onClick={() => router.push('/sign-in')}>
            Sign in
          </Link>
        </Stack>
      </Stack>
    </FlowLayout>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SignUpContent />
    </Suspense>
  );
}
