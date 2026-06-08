'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import FlowLayout from '@/components/FlowLayout';
import FetchLogo from '@/components/FetchLogo';
import Button from '@/components/Button';
import { Link } from '@/components/Link';
import { Chip } from '@/components/Chip';
import providers, { type Provider } from '@/lib/providers';

// `/invitation-sent` — v2 Stage 3 delegate-branch confirmation (FLOW-10,
// Figma 2070:146 + Pending chip from the 2047 detail).
//
// Reached from /invite after "Send invite". Confirms the invite was sent and
// surfaces the connection's PENDING state (the teammate hasn't connected yet).
// Guard pattern mirrors /connect-method verbatim:
//   1. Read ?provider= via useSearchParams (inside a <Suspense> boundary so the
//      route still pre-renders while this subtree streams on the client).
//   2. Resolve the slug against the providers catalog (single source of truth).
//      Raw query-param text is NEVER interpolated into rendered JSX — only the
//      trusted catalog `name` is rendered.
//   3. Missing OR unknown slug → render null + replace-navigate back to
//      /select-provider (replace keeps the invalid URL out of history).
//
// Demo behavior — all three actions are real navigations (no dead links):
//   • "Done"                          → / (end of the admin's flow)
//   • "Resend invite"                 → /invite (re-draft)
//   • "Open the invite … (demo)"      → /recipient (makes the recipient path
//                                       click-reachable from the UI).
// The navy success mark uses @mui/icons-material/CheckCircleRounded tinted via
// secondary.main (DS navy) — a theme palette key, not a literal color.

function InvitationSentContent() {
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
        <FetchLogo size={64} />
        <CheckCircleRounded sx={{ color: 'secondary.main', fontSize: 56 }} />
        <Typography variant="h5" component="h1" sx={{ color: 'text.primary' }}>
          Invitation sent
        </Typography>
        <Chip severity="warning" label="Pending" />
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {`We emailed your teammate a secure link to connect ${name}. The connection stays pending until they finish.`}
        </Typography>

        <Button variant="primary" sx={{ width: '100%' }} onClick={() => router.push('/')}>
          Done
        </Button>

        <Stack spacing={1} sx={{ alignItems: 'center' }}>
          <Link size="md" onClick={() => router.push(`/invite?provider=${slug}`)}>
            Resend invite
          </Link>
          <Link size="md" onClick={() => router.push(`/recipient?provider=${slug}`)}>
            Open the invite as the teammate (demo)
          </Link>
        </Stack>
      </Stack>
    </FlowLayout>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <InvitationSentContent />
    </Suspense>
  );
}
