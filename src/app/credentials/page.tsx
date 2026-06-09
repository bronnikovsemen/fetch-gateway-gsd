'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FlowLayout from '@/components/FlowLayout';
import FetchLogo from '@/components/FetchLogo';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Link from '@/components/Link';
import providers, { type Provider } from '@/lib/providers';

// `/credentials` — v2 Stage 1 self-branch credential CARD (Phase 08, CRED-01).
//
// Reached from /connect-method's "I'll connect it now" for the credentials
// (Principal) and sftp providers — replacing the old in-place Dialog modal so
// that /connecting ("Establishing connection…") is only ever reached AFTER the
// admin submits credentials. Gusto ('redirect') never lands here; it uses
// /gusto-login instead, so a redirect slug bounces back to /select-provider.
//
// Visually identical to /verify: same FlowLayout chrome, centered Stack, logo,
// h5 title, body2 subtitle, full-width primary Button, and a centered Link in
// the "optional link" slot — only the OTP cells are swapped for DS Inputs.
//
// Guard pattern mirrors /verify verbatim:
//   1. Read ?provider= via useSearchParams (inside a <Suspense> boundary so the
//      route still pre-renders while this subtree streams on the client).
//   2. Resolve the slug against the providers catalog (single source of truth).
//      Raw query-param text is NEVER interpolated into rendered JSX — only the
//      trusted catalog `name` field is.
//   3. Missing/unknown slug OR authMethod === 'redirect' → render null +
//      replace-navigate back to /select-provider (replace keeps the invalid /
//      Gusto URL out of history).
//
// Demo behavior: "Continue" always navigates to /connecting (no real
// validation), carrying the provider slug and — for credentials only — the 2FA
// flag (&2fa=1 → /verify). "Back" returns to /connect-method.

function CredentialsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slugParam = searchParams.get('provider');
  const provider: Provider | undefined = slugParam
    ? providers.find((p) => p.slug === slugParam)
    : undefined;

  const [host, setHost] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!provider || provider.authMethod === 'redirect') {
      router.replace('/select-provider');
    }
  }, [provider, router]);

  if (!provider || provider.authMethod === 'redirect') {
    return null;
  }

  const { name, slug, authMethod } = provider;
  const isSftp = authMethod === 'sftp';

  const title = isSftp ? 'Connect via SFTP' : `Sign in to ${name}`;
  const subtitle = isSftp
    ? 'Enter your SFTP administrator credentials'
    : `Enter your ${name} credentials to connect. Read-only access.`;

  const handleContinue = () => {
    const suffix = authMethod === 'credentials' ? '&2fa=1' : '';
    router.push(`/connecting?provider=${slug}${suffix}`);
  };

  return (
    <FlowLayout maxWidth={400} px={4} py={4}>
      <Stack spacing={2.5} sx={{ alignItems: 'center', textAlign: 'center' }}>
        <FetchLogo size={40} />
        <Typography variant="h5" component="h1" sx={{ color: 'text.primary' }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {subtitle}
        </Typography>

        {isSftp && (
          <Input
            label="Host"
            placeholder="Enter the host"
            value={host}
            onChange={(e) => setHost(e.target.value)}
          />
        )}
        <Input
          label={isSftp ? 'Username or Email' : 'Email or username'}
          placeholder={isSftp ? 'Enter the username/email' : undefined}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          placeholder={isSftp ? 'Enter the password' : undefined}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {isSftp && (
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Your credentials are encrypted and never stored by Fetch
          </Typography>
        )}

        <Button variant="primary" sx={{ width: '100%' }} onClick={handleContinue}>
          Continue
        </Button>

        <Stack sx={{ alignItems: 'center' }}>
          <Link onClick={() => router.push(`/connect-method?provider=${slug}`)}>
            Back
          </Link>
        </Stack>
      </Stack>
    </FlowLayout>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CredentialsContent />
    </Suspense>
  );
}
