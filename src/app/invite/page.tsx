'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FlowLayout from '@/components/FlowLayout';
import FetchLogo from '@/components/FetchLogo';
import { Input } from '@/components/Input';
import Button from '@/components/Button';
import providers, { type Provider } from '@/lib/providers';

// `/invite` — v2 Stage 3 delegate-branch entry (FLOW-10, Figma 2070:123).
//
// Reached from /connect-method when the admin chooses "Someone on my team
// manages it". The admin drafts an invite for a teammate who actually holds the
// provider credentials. Guard pattern mirrors /connect-method verbatim:
//   1. Read ?provider= via useSearchParams (inside a <Suspense> boundary so the
//      route still pre-renders while this subtree streams on the client).
//   2. Resolve the slug against the providers catalog (single source of truth).
//      Raw query-param text is NEVER interpolated into rendered JSX — only the
//      trusted catalog `name` is rendered.
//   3. Missing OR unknown slug → render null + replace-navigate back to
//      /select-provider (replace keeps the invalid URL out of history).
//
// Demo behavior: all three fields are controlled but unvalidated; "Send invite"
// is always enabled and forwards the slug to /invitation-sent (no real email).

function InviteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slugParam = searchParams.get('provider');
  const provider: Provider | undefined = slugParam
    ? providers.find((p) => p.slug === slugParam)
    : undefined;

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (!provider) {
      router.replace('/select-provider');
    }
  }, [provider, router]);

  if (!provider) {
    return null;
  }

  const { name: providerName, slug } = provider;

  return (
    <FlowLayout maxWidth={440} px={4} py={4}>
      <Stack spacing={2}>
        <Stack spacing={2} sx={{ alignItems: 'center', textAlign: 'center' }}>
          <FetchLogo size={40} />
          <Typography variant="h5" component="h1" sx={{ color: 'text.primary' }}>
            {`Ask a teammate to connect ${providerName}`}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {`We’ll email them a secure link. Credentials never leave ${providerName}.`}
          </Typography>
        </Stack>

        <Input
          label="Work email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <Stack direction="row" spacing={1.5}>
          <Button
            variant="secondary"
            sx={{ width: 120, flexShrink: 0 }}
            onClick={() => router.push(`/connect-method?provider=${slug}`)}
          >
            Back
          </Button>
          <Button
            variant="primary"
            sx={{ flex: 2 }}
            onClick={() => router.push(`/invitation-sent?provider=${slug}`)}
          >
            Send invite
          </Button>
        </Stack>
      </Stack>
    </FlowLayout>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <InviteContent />
    </Suspense>
  );
}
