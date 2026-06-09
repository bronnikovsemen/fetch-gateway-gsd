'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// `/gusto-login` — bespoke 2-step Gusto OAuth mock (DEMO-02).
//
// The SINGLE bespoke-branding exception in the codebase: it recreates Gusto's
// own sign-in + OAuth-authorize screens, so it uses Gusto brand hex INLINE
// (scoped here only — NOT the Fetch DS tokens, NOT FetchLogo). Excluded from the
// lint:tokens HEX gate via package.json; the PX gate still applies, so every
// spacing/size is a bare numeric sx value (no `'Npx'` string literals; the
// `Npx solid ${color}` borders are template literals, which the gate ignores).
//
// Layout mirrors the real Gusto pages: an original decorative illustration on
// the left and the auth card on the right, vertically centered. (The actual
// Gusto marketing illustration is their proprietary artwork — the left graphic
// here is an original generic placeholder.)
//
// Collected email/password are demo-only local state — never validated, sent,
// or stored.

type Step = 'signin' | 'authorize';

// Gusto bespoke palette (this file only).
const GUSTO = {
  coral: '#F45D48',
  teal: '#1B7B6B',
  tealHover: '#15685A',
  text: '#1A1A1A',
  ink: '#1E2532',
  muted: '#6B7280',
  border: '#D7DBE0',
  fieldBorder: '#C6CBD2',
  deny: '#C0392B',
  googleBlue: '#4285F4',
  bg: '#FFFFFF',
  sage: '#3F8E7C',
  sand: '#E7B84B',
} as const;

const inputSx = {
  width: '100%',
  boxSizing: 'border-box',
  height: 44,
  px: 1.5,
  fontSize: 15,
  color: GUSTO.text,
  borderRadius: 1,
  border: `1px solid ${GUSTO.fieldBorder}`,
  outline: 'none',
  fontFamily: 'inherit',
  '&:focus': {
    borderColor: GUSTO.teal,
    boxShadow: `0 0 0 2px ${GUSTO.teal}33`,
  },
} as const;

const tealButtonSx = {
  width: '100%',
  height: 44,
  fontSize: 15,
  fontWeight: 600,
  color: GUSTO.bg,
  bgcolor: GUSTO.teal,
  border: 'none',
  borderRadius: 1,
  cursor: 'pointer',
  fontFamily: 'inherit',
  '&:hover': { bgcolor: GUSTO.tealHover },
} as const;

const tealLinkSx = {
  color: GUSTO.teal,
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  textDecoration: 'underline',
  '&:hover': { textDecoration: 'none' },
} as const;

function Wordmark() {
  return (
    <Typography
      component="span"
      sx={{ color: GUSTO.coral, fontWeight: 800, fontSize: 30, lineHeight: 1, letterSpacing: '-0.01em' }}
    >
      gusto
    </Typography>
  );
}

function GoogleG() {
  return (
    <Box component="span" sx={{ display: 'inline-flex' }} aria-hidden>
      <svg width="18" height="18" viewBox="0 0 18 18">
        <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.71-1.57 2.68-3.88 2.68-6.62Z" />
        <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z" />
        <path fill="#FBBC05" d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.05l3.01-2.33Z" />
        <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z" />
      </svg>
    </Box>
  );
}

function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={GUSTO.muted} strokeWidth="2" aria-hidden>
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

// Original generic decorative illustration (NOT Gusto's proprietary artwork):
// a pair of potted plants on plinths beside a simple window frame.
function GustoScene() {
  return (
    <Box
      aria-hidden
      sx={{ flexShrink: 0, display: { xs: 'none', md: 'block' }, width: 360 }}
    >
      <svg width="360" height="320" viewBox="0 0 360 320" fill="none">
        <g stroke={GUSTO.text} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* window frame */}
          <rect x="132" y="40" width="96" height="120" rx="6" fill={GUSTO.bg} />
          <line x1="180" y1="40" x2="180" y2="160" />
          <line x1="132" y1="100" x2="228" y2="100" />
          {/* left plinth + plant */}
          <rect x="40" y="210" width="56" height="74" fill={GUSTO.bg} />
          <path d="M68 210c-6-22-22-30-26-46 16 2 28 12 30 30" fill={GUSTO.sage} />
          <path d="M68 210c6-26 24-30 34-44-2 18-14 34-30 44" fill={GUSTO.sage} />
          <path d="M58 196c0-12-10-18-14-28 12 2 18 12 18 24" fill="none" />
          {/* right plinth + plant */}
          <rect x="264" y="210" width="56" height="74" fill={GUSTO.bg} />
          <ellipse cx="292" cy="196" rx="26" ry="20" fill={GUSTO.sand} />
          <path d="M292 176v-30M292 176c-12-4-18-16-18-28M292 176c12-4 18-16 18-28" />
          {/* floor line */}
          <line x1="20" y1="284" x2="340" y2="284" />
        </g>
      </svg>
    </Box>
  );
}

export default function Page() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: GUSTO.bg,
        display: 'flex',
        flexDirection: 'column',
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: { xs: 0, md: 12 },
          px: 4,
          py: 6,
        }}
      >
        <GustoScene />

        <Box
          sx={{
            width: '100%',
            maxWidth: 372,
            bgcolor: GUSTO.bg,
            border: `1px solid ${GUSTO.border}`,
            borderRadius: 2,
            boxShadow: '0 1px 2px rgba(26, 26, 26, 0.06)',
            p: 4,
          }}
        >
          {step === 'signin' ? (
            <Stack spacing={2.5}>
              <Wordmark />
              <Typography sx={{ color: GUSTO.text, fontWeight: 700, fontSize: 26, lineHeight: 1.1 }}>
                Sign In
              </Typography>

              <Stack spacing={0.75}>
                <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: GUSTO.ink, fontWeight: 600, fontSize: 14 }}>Email</Typography>
                  <Box component="span" sx={tealLinkSx}>Forgot email?</Box>
                </Box>
                <Box
                  component="input"
                  type="email"
                  autoFocus
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  sx={inputSx}
                />
              </Stack>

              <Stack spacing={0.75}>
                <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: GUSTO.ink, fontWeight: 600, fontSize: 14 }}>Password</Typography>
                  <Box component="span" sx={tealLinkSx}>Forgot password?</Box>
                </Box>
                <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Box
                    component="input"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    sx={{ ...inputSx, pr: 5 }}
                  />
                  <Box
                    component="button"
                    type="button"
                    aria-label="Toggle password visibility"
                    onClick={() => setShowPassword((v) => !v)}
                    sx={{
                      position: 'absolute',
                      right: 8,
                      display: 'inline-flex',
                      alignItems: 'center',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      p: 0.5,
                    }}
                  >
                    <EyeIcon />
                  </Box>
                </Box>
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
                  height: 44,
                  fontSize: 15,
                  fontWeight: 600,
                  color: GUSTO.text,
                  bgcolor: GUSTO.bg,
                  border: `1px solid ${GUSTO.fieldBorder}`,
                  borderRadius: 1,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1.25,
                  '&:hover': { bgcolor: '#F7F8FA' },
                }}
              >
                <GoogleG />
                Sign in with Google
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.5,
                  color: GUSTO.muted,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                More sign in options
                <Box component="span" sx={{ fontSize: 11 }}>▾</Box>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1.5, pt: 0.5 }}>
                <Box component="span" sx={tealLinkSx}>Get started</Box>
                <Typography sx={{ color: GUSTO.muted, fontSize: 13 }}>·</Typography>
                <Box component="span" sx={tealLinkSx}>Help center</Box>
              </Box>
            </Stack>
          ) : (
            <Stack spacing={3}>
              <Wordmark />
              <Typography sx={{ color: GUSTO.text, fontWeight: 700, fontSize: 22, lineHeight: 1.25 }}>
                Authorize Fetch to connect to your account?
              </Typography>
              <Typography sx={{ color: GUSTO.muted, fontSize: 15, lineHeight: 1.55 }}>
                Authorizing <b style={{ color: GUSTO.text }}>Fetch</b> to connect to your Gusto account
                will allow <b style={{ color: GUSTO.text }}>Fetch</b> to view and access{' '}
                <b style={{ color: GUSTO.text }}>Plantegrity&rsquo;s</b> account information.
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
                    textDecoration: 'underline',
                    '&:hover': { textDecoration: 'none' },
                  }}
                >
                  Deny
                </Box>
              </Box>
            </Stack>
          )}
        </Box>
      </Box>

      {step === 'signin' && (
        <Box
          component="footer"
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.5,
            py: 3,
            color: GUSTO.muted,
            fontSize: 13,
          }}
        >
          <Box component="span">Gusto © 2026</Box>
          <Box component="span" sx={tealLinkSx}>Help Center</Box>
          <Box component="span" sx={tealLinkSx}>Terms</Box>
          <Box component="span" sx={tealLinkSx}>Privacy</Box>
          <Box component="span" sx={tealLinkSx}>Privacy Choices</Box>
        </Box>
      )}
    </Box>
  );
}
