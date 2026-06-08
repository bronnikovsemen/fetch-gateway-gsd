'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FlowLayout from '@/components/FlowLayout';
import FetchLogo from '@/components/FetchLogo';
import OptionRow from '@/components/OptionRow';
import providers, { type Provider } from '@/lib/providers';

// `/connect-method` — v2 Stage 1 decision screen (FLOW-09, Figma 2068:155).
//
// Sits between /select-provider and the two connection branches. After the
// admin picks a provider, this screen asks WHO will actually connect it:
//   • "I'll connect it now"  (self)     → /connecting?provider={slug}
//   • "Someone on my team…"  (delegate) → /invite?provider={slug}  (Stage 3)
//
// Guard pattern mirrors /connecting verbatim:
//   1. Read ?provider= via useSearchParams (inside a <Suspense> boundary so the
//      route still pre-renders while this subtree streams on the client).
//   2. Resolve the slug against the providers catalog (single source of truth).
//      Raw query-param text is NEVER interpolated into the rendered JSX — only
//      the trusted catalog `name` is rendered.
//   3. Missing OR unknown slug → render null + replace-navigate back to
//      /select-provider (replace keeps the invalid URL out of history).
//
// Stage-1 note: the delegate destination /invite lands in Stage 3 and 404s
// until then — an intentional forward navigation in branch-at-a-time delivery,
// not a dead button.

function ConnectMethodContent() {
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
    <FlowLayout maxWidth={440} px={4} py={4}>
      <Stack spacing={2}>
        <Stack spacing={2} sx={{ alignItems: 'center', textAlign: 'center' }}>
          <FetchLogo size={64} />
          <Typography variant="h5" component="h1" sx={{ color: 'text.primary' }}>
            {`How do you want to connect ${name}?`}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {`Pick whoever has access to your ${name} account.`}
          </Typography>
        </Stack>

        <OptionRow
          title="I’ll connect it now"
          description={`I have access to ${name}`}
          // &2fa=1 drives the self demo through Establishing → 2FA → Success.
          // Omitting it is the no-2FA variant (Establishing → Success straight).
          onClick={() => router.push(`/connecting?provider=${slug}&2fa=1`)}
        />
        <OptionRow
          title="Someone on my team manages it"
          description="We’ll send them a secure link to connect"
          onClick={() => router.push(`/invite?provider=${slug}`)}
        />
      </Stack>
    </FlowLayout>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ConnectMethodContent />
    </Suspense>
  );
}
