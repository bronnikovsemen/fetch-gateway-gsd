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
// "Create account" first sends the admin to /verify-email (email-ownership OTP),
// carrying the entered email and the demo org flag. Verify-email then resumes
// the same branch this screen used to take directly:
//   • org unset       → /create-organization  (no existing org)
//   • org === existing → /join-organization     (org already exists)

function SignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const org = searchParams.get('org');

  const [workEmail, setWorkEmail] = useState('');
  const [invitationCode, setInvitationCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleCreate = () => {
    const base = `/verify-email?email=${encodeURIComponent(workEmail)}`;
    router.push(org === 'existing' ? `${base}&org=existing` : base);
  };

  // Enter in any field submits — same as the Create account button (no <form>).
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      handleCreate();
    }
  };

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
          onKeyDown={handleKeyDown}
        />
        <Input
          label="Invitation code"
          value={invitationCode}
          onChange={(e) => setInvitationCode(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Input
          label="Confirm password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <Button variant="primary" sx={{ width: '100%' }} onClick={handleCreate}>
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
