'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import FlowLayout from '@/components/FlowLayout';
import FetchLogo from '@/components/FetchLogo';
import providers, { type Provider } from '@/lib/providers';

// `/connecting` — transient bridge route between the user's decision
// (/select-provider) and the splash route (/). Closes FLOW-06 (spinner +
// provider-name body copy) and FLOW-07 (?provider= query-param guard —
// invalid/missing redirects back to the selection screen).
//
// Behavior summary:
//   1. Read ?provider= from the URL (useSearchParams).
//   2. Look the slug up in the providers catalog (src/lib/providers.ts —
//      single source of truth for the four supported providers). Raw
//      query-param text is NEVER interpolated into the rendered JSX — only
//      the trusted catalog `name` field is rendered (T-03-02-02 mitigation).
//   3. Missing OR unknown slug → render null + replace-navigate back to the
//      selection screen. Using replace (not push) keeps the invalid URL out
//      of browser history so back-button does not land on a redirecting page.
//   4. Valid slug → render the centered white panel (FetchLogo +
//      CircularProgress + heading + provider-name body copy) and schedule a
//      2500ms setTimeout that replace-navigates to / (the splash) on
//      completion. The splash then auto-advances to /welcome, looping the
//      demo. The cleanup clears the pending timer on unmount (T-03-02-01).
//
// Both navigations on this page use replace-style routing, not push:
// /connecting is THE canonical transient bridge route in the demo flow and
// must not sit in browser history (T-03-02-03 mitigation; locally acts on
// Phase 2 REVIEW WR-01's advisory which the splash deferred).
//
// useSearchParams requires either a <Suspense> boundary or a dynamic-rendering
// opt-out. /connecting is meaningless without query params (the route only
// exists as a transient bridge driven by ?provider=), so force-dynamic is
// the simpler choice over wrapping the page in Suspense.

export const dynamic = 'force-dynamic';

export default function Page() {
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
    timerRef.current = setTimeout(() => { router.replace('/'); }, 2500);
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
    <FlowLayout maxWidth={440}>
      <Stack spacing={3} sx={{ alignItems: 'center' }}>
        <FetchLogo size={100} />
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
