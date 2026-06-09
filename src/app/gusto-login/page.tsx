'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// `/gusto-login` — bespoke 2-step Gusto OAuth mock (DEMO-02).
//
// This is the SINGLE bespoke-branding exception in the codebase: it recreates
// Gusto's own sign-in + OAuth-authorize screens, so it uses Gusto's brand hex
// INLINE (scoped to this file only — NOT the Fetch DS tokens, NOT FetchLogo).
// The file is excluded from the lint:tokens HEX gate via package.json; the PX
// gate is NOT excluded, so every spacing/sizing value here is a bare numeric sx
// value (no `'Npx'` string literals anywhere).
//
// Two steps via local state. The collected email/password are demo-only local
// state — never validated, never submitted, never stored, never sent anywhere.
//
// NOTE: the left-side marketing illustration on the real Gusto sign-in page is
// intentionally omitted — a centered card is an acceptable mock.

type Step = 'signin' | 'authorize';

// Gusto bespoke palette (this file only).
const GUSTO = {
  coral: '#F45D48',
  teal: '#1C7C6E',
  tealHover: '#16685C',
  ink: '#1E0E35',
  muted: '#6B7281',
  border: '#D8DEE4',
  deny: '#C0392B',
  bg: '#FFFFFF',
} as const;

const inputSx = {
  width: '100%',
  boxSizing: 'border-box',
  p: 1.25,
  fontSize: 15,
  color: GUSTO.ink,
  borderRadius: 2,
  border: `1px solid ${GUSTO.border}`,
  outline: 'none',
  fontFamily: 'inherit',
  '&:focus': {
    borderColor: GUSTO.teal,
    boxShadow: `0 0 0 1px ${GUSTO.teal}`,
  },
} as const;

const tealButtonSx = {
  width: '100%',
  p: 1.25,
  fontSize: 15,
  fontWeight: 600,
  color: GUSTO.bg,
  bgcolor: GUSTO.teal,
  border: 'none',
  borderRadius: 2,
  cursor: 'pointer',
  fontFamily: 'inherit',
  '&:hover': { bgcolor: GUSTO.tealHover },
} as const;

const tealLinkSx = {
  color: GUSTO.teal,
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  '&:hover': { textDecoration: 'underline' },
} as const;

function Wordmark() {
  return (
    <Typography sx={{ color: GUSTO.coral, fontWeight: 700, fontSize: 28, lineHeight: 1 }}>
      gusto
    </Typography>
  );
}

export default function Page() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: GUSTO.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 420,
          bgcolor: GUSTO.bg,
          border: `1px solid ${GUSTO.border}`,
          borderRadius: 3,
          boxShadow: '0 4px 24px rgba(30, 14, 53, 0.08)',
          p: 4,
        }}
      >
        {step === 'signin' ? (
          <Stack spacing={2.5}>
            <Wordmark />
            <Typography sx={{ color: GUSTO.ink, fontWeight: 700, fontSize: 22 }}>
              Sign In
            </Typography>

            <Stack spacing={0.75}>
              <Box
                sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}
              >
                <Typography sx={{ color: GUSTO.ink, fontWeight: 600, fontSize: 14 }}>
                  Email
                </Typography>
                <Box component="span" sx={tealLinkSx}>
                  Forgot email?
                </Box>
              </Box>
              <Box
                component="input"
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                sx={inputSx}
              />
            </Stack>

            <Stack spacing={0.75}>
              <Box
                sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}
              >
                <Typography sx={{ color: GUSTO.ink, fontWeight: 600, fontSize: 14 }}>
                  Password
                </Typography>
                <Box component="span" sx={tealLinkSx}>
                  Forgot password?
                </Box>
              </Box>
              <Box
                component="input"
                type="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                sx={inputSx}
              />
            </Stack>

            <Box component="button" type="button" onClick={() => setStep('authorize')} sx={tealButtonSx}>
              Continue
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ flex: 1, height: 1, bgcolor: GUSTO.border }} />
              <Typography sx={{ color: GUSTO.muted, fontSize: 13 }}>or</Typography>
              <Box sx={{ flex: 1, height: 1, bgcolor: GUSTO.border }} />
            </Box>

            <Box
              component="button"
              type="button"
              onClick={() => setStep('authorize')}
              sx={{
                width: '100%',
                p: 1.25,
                fontSize: 15,
                fontWeight: 600,
                color: GUSTO.ink,
                bgcolor: GUSTO.bg,
                border: `1px solid ${GUSTO.border}`,
                borderRadius: 2,
                cursor: 'pointer',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                '&:hover': { bgcolor: '#F7F8FA' },
              }}
            >
              <Box component="span" sx={{ color: GUSTO.coral, fontWeight: 700 }}>
                G
              </Box>
              Sign in with Google
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, pt: 1 }}>
              <Box component="span" sx={tealLinkSx}>
                Get started
              </Box>
              <Typography sx={{ color: GUSTO.muted, fontSize: 13 }}>·</Typography>
              <Box component="span" sx={tealLinkSx}>
                Help center
              </Box>
            </Box>
          </Stack>
        ) : (
          <Stack spacing={2.5}>
            <Wordmark />
            <Typography sx={{ color: GUSTO.ink, fontWeight: 700, fontSize: 20 }}>
              Authorize Fetch to connect to your account?
            </Typography>
            <Typography sx={{ color: GUSTO.muted, fontSize: 15, lineHeight: 1.5 }}>
              Authorizing Fetch to connect to your Gusto account will allow Fetch to view and access
              your payroll account information.
            </Typography>

            <Box
              component="button"
              type="button"
              onClick={() => router.push('/connecting?provider=gusto')}
              sx={tealButtonSx}
            >
              Authorize
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box
                component="span"
                onClick={() => router.push('/connect-method?provider=gusto')}
                sx={{
                  color: GUSTO.deny,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Deny
              </Box>
            </Box>
          </Stack>
        )}
      </Box>
    </Box>
  );
}
