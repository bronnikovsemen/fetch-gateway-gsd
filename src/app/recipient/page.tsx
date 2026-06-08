'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FlowLayout from '@/components/FlowLayout';
import FetchLogo from '@/components/FetchLogo';
import Button from '@/components/Button';
import providers, { type Provider } from '@/lib/providers';

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
// Demo behavior: "Get Started" enters the shared self tail by forwarding the
// slug with the &2fa=1 flag to /connecting (Establishing → 2FA → Success).

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

  const { name, slug } = provider;

  return (
    <FlowLayout maxWidth={400} px={4} py={4}>
      <Stack spacing={2} sx={{ alignItems: 'center', textAlign: 'center' }}>
        <FetchLogo size={40} />
        <Typography variant="h5" component="h1" sx={{ color: 'text.primary' }}>
          {`Plantegrity asked you to connect ${name}`}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {`Acme Inc. invited you to securely connect your ${name} account. Read-only — no data is modified.`}
        </Typography>

        <Button
          variant="primary"
          sx={{ width: '100%' }}
          onClick={() => router.push(`/connecting?provider=${slug}&2fa=1`)}
        >
          Get Started
        </Button>

        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Continues through the same Permissions → sign-in → Success steps.
        </Typography>
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
