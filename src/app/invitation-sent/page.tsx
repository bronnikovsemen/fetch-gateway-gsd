'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FlowLayout from '@/components/FlowLayout';
import FetchLogo from '@/components/FetchLogo';
import Button from '@/components/Button';
import { Link } from '@/components/Link';
import providers, { type Provider } from '@/lib/providers';

// `/invitation-sent` — Stage 3 delegate-branch confirmation (Figma 456:176).
//
// Reached from /invite after "Send invite". Confirms the invite was sent; the
// subtitle conveys that the connection stays pending until the teammate finishes.
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
// Per the current Figma (456:176) this screen has no success mark and no
// "Pending" chip — just the heading, subtitle, "Done" CTA, and the two links.

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
        <FetchLogo size={40} />
        <Typography variant="h5" component="h1" sx={{ color: 'text.primary' }}>
          Invitation sent
        </Typography>
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
