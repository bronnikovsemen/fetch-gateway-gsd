'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FlowLayout from '@/components/FlowLayout';
import FetchLogo from '@/components/FetchLogo';
import Button from '@/components/Button';
import Link from '@/components/Link';
import { tokens } from '@/theme/theme';
import providers, { type Provider } from '@/lib/providers';

// `/verify` — v2 Stage 2 self-branch 2FA gate (FLOW-11, Figma 2069:116).
//
// Reached from /connecting when the demo 2FA flag (?2fa=1) is set; /connecting
// forwards the provider slug here. Guard pattern mirrors /connecting verbatim:
//   1. Read ?provider= via useSearchParams (inside a <Suspense> boundary so the
//      route still pre-renders while this subtree streams on the client).
//   2. Resolve the slug against the providers catalog (single source of truth).
//      Raw query-param text is NEVER interpolated into rendered JSX — only the
//      trusted catalog `name` field would be (this screen renders no name copy,
//      but the guard is preserved for parity + a clean redirect contract).
//   3. Missing OR unknown slug → render null + replace-navigate back to
//      /select-provider (replace keeps the invalid URL out of history).
//
// OTP: no DS OTP component exists, so the 6-cell field is assembled from
// token-styled MUI Box primitives plus a single visually-hidden native capture
// input (Box component="input") overlaying the row — a legitimate raw-MUI
// exception. The active cell (next empty slot, clamped to the last index) takes
// a 2px Brand Accent (primary.main) border; the rest take a 1px divider border.
//
// Demo behavior: "Verify" always navigates to /success (not a dead button — no
// real code validation); "Resend code" clears the entered digits.

const CELL_COUNT = 6;

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

  // Active cell = next empty slot, clamped to the final index once full.
  const activeIndex = Math.min(code.length, CELL_COUNT - 1);

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

        <Box sx={{ position: 'relative' }}>
          <Stack direction="row" spacing={1} sx={{ justifyContent: 'center' }}>
            {Array.from({ length: CELL_COUNT }).map((_, i) => {
              const isActive = i === activeIndex;
              const isFilled = i < code.length;
              return (
                <Box
                  key={i}
                  sx={{
                    width: 48,
                    height: 56,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    // Active & empty cells use the paper surface; filled non-active
                    // cells use the slightly-tinted default background.
                    bgcolor: isActive
                      ? 'background.paper'
                      : isFilled
                        ? 'background.default'
                        : 'background.paper',
                    // MUI multiplies a numeric borderRadius by shape.borderRadius
                    // (= tokens.radius.lg); this ratio yields exactly radius.md px.
                    borderRadius: tokens.radius.md / tokens.radius.lg,
                    border: isActive ? '2px solid' : '1px solid',
                    borderColor: isActive ? 'primary.main' : 'divider',
                  }}
                >
                  <Typography variant="h5" sx={{ color: 'text.primary' }}>
                    {code[i] ?? ''}
                  </Typography>
                </Box>
              );
            })}
          </Stack>
          <Box
            component="input"
            inputMode="numeric"
            maxLength={CELL_COUNT}
            value={code}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCode(e.target.value.replace(/\D/g, '').slice(0, CELL_COUNT))
            }
            sx={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              opacity: 0,
              cursor: 'text',
              border: 'none',
              padding: 0,
              margin: 0,
              background: 'transparent',
            }}
          />
        </Box>

        <Button variant="primary" sx={{ width: '100%' }} onClick={() => router.push('/success')}>
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
