'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FlowLayout from '@/components/FlowLayout';
import FetchLogo from '@/components/FetchLogo';
import Button from '@/components/Button';
import Link from '@/components/Link';
import OTPInput from '@/components/OTPInput';

// `/verify-email` — email-ownership check after /sign-up (Figma OTPInput 448:64).
//
// An AUTH-flow screen, NOT a provider-flow screen: it reads ?email= and ?org=
// via useSearchParams (inside a <Suspense> boundary, like its siblings) but does
// NOT copy the provider guard — there is no catalog to resolve against and no
// redirect contract to honour. A missing email simply falls back to the generic
// phrase "your email". The email param is rendered as text only (React escapes
// it); it is never passed to dangerouslySetInnerHTML or a URL sink.
//
// Demo behavior (no real validation): "Verify" mirrors the /sign-up branch —
// org === 'existing' → /join-organization, otherwise /create-organization.
// "Resend code" clears the digits; "Back" returns to /sign-up preserving ?org=.
// Enter on a complete 6-digit code submits, same as the Verify button.

const CELL_COUNT = 6;

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const org = searchParams.get('org');

  const [code, setCode] = useState('');

  const handleVerify = () => {
    router.push(org === 'existing' ? '/join-organization' : '/create-organization');
  };

  // Enter on a full 6-digit code submits — same target as the Verify button.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && code.length === CELL_COUNT) {
      handleVerify();
    }
  };

  const backHref = org === 'existing' ? '/sign-up?org=existing' : '/sign-up';
  const target = email ?? 'your email';

  return (
    <FlowLayout maxWidth={400} px={4} py={4}>
      <Stack
        spacing={2.5}
        sx={{ alignItems: 'center', textAlign: 'center' }}
        onKeyDown={handleKeyDown}
      >
        <FetchLogo size={40} />
        <Typography variant="h5" component="h1" sx={{ color: 'text.primary' }}>
          Verify your email
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {`We sent a 6-digit code to ${target}. Enter it to confirm this address belongs to you.`}
        </Typography>

        <OTPInput value={code} onChange={setCode} />

        <Button variant="primary" sx={{ width: '100%' }} onClick={handleVerify}>
          Verify
        </Button>

        <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Didn’t receive a code?
          </Typography>
          <Link size="sm" onClick={() => setCode('')}>
            Resend code
          </Link>
        </Stack>

        <Link onClick={() => router.push(backHref)}>
          Back
        </Link>
      </Stack>
    </FlowLayout>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}
