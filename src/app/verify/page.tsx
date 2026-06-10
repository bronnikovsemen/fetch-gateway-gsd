'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FlowLayout from '@/components/FlowLayout';
import FetchLogo from '@/components/FetchLogo';
import Button from '@/components/Button';
import Link from '@/components/Link';
import OTPInput from '@/components/OTPInput';
import providers, { type Provider } from '@/lib/providers';

// `/verify` — v2 Stage 2 self-branch 2FA gate (FLOW-11, Figma 2069:116).
//
// Reached from the /credentials card for credentials providers (Principal) —
// 2FA runs BEFORE the /connecting "Establishing…" bridge. Guard mirrors
// /connecting verbatim:
//   1. Read ?provider= via useSearchParams (inside a <Suspense> boundary so the
//      route still pre-renders while this subtree streams on the client).
//   2. Resolve the slug against the providers catalog (single source of truth).
//      Raw query-param text is NEVER interpolated into rendered JSX — only the
//      trusted catalog `name` field would be (this screen renders no name copy,
//      but the guard is preserved for parity + a clean redirect contract).
//   3. Missing OR unknown slug → render null + replace-navigate back to
//      /select-provider (replace keeps the invalid URL out of history).
//
// OTP: the 6-cell field is the shared OTPInput DS component (Figma 448:64) — the
// cells + visually-hidden capture input + autofocus + focus-bound active border
// live there now, so this screen just owns the code state + navigation.
//
// Demo behavior: "Verify" always navigates to /connecting (the "Establishing…"
// bridge, which then advances to /success) — 2FA happens BEFORE establishing the
// connection, not after. "Resend code" clears the entered digits.

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slugParam = searchParams.get('provider');
  const provider: Provider | undefined = slugParam
    ? providers.find((p) => p.slug === slugParam)
    : undefined;

  const [code, setCode] = useState('');

  useEffect(() => {
    if (!provider) {
      router.replace('/select-provider');
    }
  }, [provider, router]);

  if (!provider) {
    return null;
  }

  return (
    <FlowLayout maxWidth={400} px={4} py={4}>
      <Stack spacing={2.5} sx={{ alignItems: 'center', textAlign: 'center' }}>
        <FetchLogo size={40} />
        <Typography variant="h5" component="h1" sx={{ color: 'text.primary' }}>
          Enter verification code
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          We sent a 6-digit code to your phone
        </Typography>

        <OTPInput value={code} onChange={setCode} />

        <Button variant="primary" sx={{ width: '100%' }} onClick={() => router.push(`/connecting?provider=${provider.slug}`)}>
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
      </Stack>
    </FlowLayout>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <VerifyContent />
    </Suspense>
  );
}
