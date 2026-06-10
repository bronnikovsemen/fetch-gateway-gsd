'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FlowLayout from '@/components/FlowLayout';
import FetchLogo from '@/components/FetchLogo';
import Button from '@/components/Button';
import providers, { type Provider } from '@/lib/providers';
import { connectNowPath } from '@/lib/connectRoute';

// `/recipient` — v2 Stage 3 delegate-branch recipient landing (FLOW-10,
// Figma 2070:162).
//
// Reached when the invited teammate "opens" the secure link (in the demo, via
// the "Open the invite as the teammate" link on /invitation-sent). Frames the
// read-only ask, then drops the recipient into the SAME self tail the admin
// would take. Guard pattern mirrors /connect-method verbatim:
//   1. Read ?provider= via useSearchParams (inside a <Suspense> boundary so the
//      route still pre-renders while this subtree streams on the client).
//   2. Resolve the slug against the providers catalog (single source of truth).
//      Raw query-param text is NEVER interpolated into rendered JSX — only the
//      trusted catalog `name` is rendered.
//   3. Missing OR unknown slug → render null + replace-navigate back to
//      /select-provider (replace keeps the invalid URL out of history).
//
// Demo behavior: "Get Started" enters the SAME per-type credential entry as the
// self path (via the shared connectNowPath helper): Gusto → /gusto-login mock,
// Principal → /credentials (creds) → /verify (2FA), SFTP → /credentials (host +
// creds). No hardcoded self-tail and no &2fa=1 — the credential card / 2FA
// ordering handles it downstream.

function RecipientContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slugParam = searchParams.get('provider');
  const provider: Provider | undefined = slugParam
    ? providers.find((p) => p.slug === slugParam)
    : undefined;

  useEffect(() => {
    if (!provider) {
      router.replace('/select-provider');
    }
  }, [provider, router]);

  if (!provider) {
    return null;
  }

  const { name } = provider;

  return (
    <FlowLayout maxWidth={400} px={4} py={4}>
      <Stack spacing={2} sx={{ alignItems: 'center', textAlign: 'center' }}>
        <FetchLogo size={40} />
        <Typography variant="h5" component="h1" sx={{ color: 'text.primary' }}>
          {`Acme Inc. asked you to connect ${name}`}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {`Acme Inc. invited you to securely connect your ${name} account. Read-only — no data is modified.`}
        </Typography>

        <Button
          variant="primary"
          sx={{ width: '100%' }}
          onClick={() => router.push(connectNowPath(provider))}
        >
          Get Started
        </Button>
      </Stack>
    </FlowLayout>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <RecipientContent />
    </Suspense>
  );
}
