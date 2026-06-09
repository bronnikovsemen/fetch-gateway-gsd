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
// /connecting is the FINAL "establishing" bridge — it is reached ONLY after the
// user has already authenticated (credentials card, 2FA, or the Gusto authorize
// mock), so it always advances to /success. 2FA happens BEFORE this screen
// (credentials → /verify → /connecting → /success), never after it.
//
// Behavior summary:
//   1. Read ?provider= from the URL (useSearchParams).
//   2. Look the slug up in the providers catalog (src/lib/providers.ts —
//      single source of truth). Raw query-param text is NEVER interpolated into
//      the rendered JSX — only the trusted catalog `name` field is rendered.
//   3. Missing OR unknown slug → render null + replace-navigate back to the
//      selection screen. Using replace (not push) keeps the invalid URL out of
//      browser history so back-button does not land on a redirecting page.
//   4. Valid slug → render the centered white panel (FetchLogo + spinner +
//      heading + provider-name body copy) and schedule a 2500ms setTimeout that
//      replace-navigates to /success. The cleanup clears the timer on unmount.
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
    // /connecting is the FINAL "establishing" bridge, reached only after the
    // user has authenticated (credentials / 2FA / Gusto authorize). It always
    // advances to /success — 2FA happens BEFORE this screen, never after.
    timerRef.current = setTimeout(() => {
      router.replace('/success');
    }, 2500);
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [provider, router]);

  if (!provider) {
    return null;
  }

  return (
    <FlowLayout maxWidth={400}>
      <Stack spacing={3} sx={{ alignItems: 'center' }}>
        <FetchLogo />
        <CircularProgress color="primary" size={48} />
        <Typography
          variant="h5"
          component="h1"
          sx={{ color: 'text.primary', textAlign: 'center' }}
        >
          Establishing connection…
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary', textAlign: 'center', whiteSpace: 'pre-line' }}
        >
          {`Securely connecting to ${provider.name}.\nThis will only take a moment.`}
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
