'use client';

import { Suspense, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import FlowLayout from '@/components/FlowLayout';
import FetchLogo from '@/components/FetchLogo';
import providers, { type Provider } from '@/lib/providers';

// `/connecting` — transient bridge route between the user's decision
// (/connect-method) and the self-branch terminus. Closes FLOW-06 (spinner +
// provider-name body copy) and FLOW-07 (?provider= query-param guard —
// invalid/missing redirects back to the selection screen).
//
// Behavior summary:
//   1. Read ?provider= and the demo 2FA flag ?2fa=1 from the URL
//      (useSearchParams).
//   2. Look the slug up in the providers catalog (src/lib/providers.ts —
//      single source of truth for the four supported providers). Raw
//      query-param text is NEVER interpolated into the rendered JSX — only
//      the trusted catalog `name` field is rendered (T-03-02-02 mitigation).
//   3. Missing OR unknown slug → render null + replace-navigate back to the
//      selection screen. Using replace (not push) keeps the invalid URL out
//      of browser history so back-button does not land on a redirecting page.
//   4. Valid slug → render the centered white panel (FetchLogo +
//      CircularProgress + heading + provider-name body copy) and schedule a
//      2500ms setTimeout that replace-navigates onward on completion:
//        • ?2fa=1 present → /verify?provider={slug} (the self-branch 2FA gate),
//        • otherwise      → /success (the no-2FA self-branch terminus).
//      The cleanup clears the pending timer on unmount (T-03-02-01).
//
// Both navigations on this page use replace-style routing, not push:
// /connecting is THE canonical transient bridge route in the demo flow and
// must not sit in browser history (T-03-02-03 mitigation; locally acts on
// Phase 2 REVIEW WR-01's advisory which the splash deferred).
//
// useSearchParams reads from the request URL, which Next.js requires to be
// inside a <Suspense> boundary so the rest of the route can pre-render at
// build time while this subtree streams on the client. ConnectingContent
// owns the useSearchParams call; the default export wraps it.

function ConnectingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slugParam = searchParams.get('provider');
  const twofa = searchParams.get('2fa') === '1';
  const provider: Provider | undefined = slugParam
    ? providers.find((p) => p.slug === slugParam)
    : undefined;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!provider) {
      router.replace('/select-provider');
    }
  }, [provider, router]);

  useEffect(() => {
    if (!provider) return;
    timerRef.current = setTimeout(() => {
      router.replace(twofa ? `/verify?provider=${provider.slug}` : '/success');
    }, 2500);
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [provider, twofa, router]);

  if (!provider) {
    return null;
  }

  return (
    <FlowLayout maxWidth={440}>
      <Stack spacing={3} sx={{ alignItems: 'center' }}>
        <FetchLogo size={56} />
        <CircularProgress color="primary" size={48} />
        <Typography
          variant="h5"
          component="h1"
          sx={{ fontWeight: 700, color: 'text.primary', textAlign: 'center' }}
        >
          Establishing connection…
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: 'text.secondary', textAlign: 'center' }}
        >
          {`Connecting to ${provider.name}. You'll be redirected to sign in.`}
        </Typography>
      </Stack>
    </FlowLayout>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ConnectingContent />
    </Suspense>
  );
}
