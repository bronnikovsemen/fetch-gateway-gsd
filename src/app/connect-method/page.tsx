'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import FlowLayout from '@/components/FlowLayout';
import FetchLogo from '@/components/FetchLogo';
import OptionRow from '@/components/OptionRow';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Link from '@/components/Link';
import providers, { type Provider } from '@/lib/providers';
import { tokens } from '@/theme/theme';

// `/connect-method` — v2 Stage 1 decision screen (FLOW-09, Figma 2068:155).
//
// Sits between /select-provider and the two connection branches. After the
// admin picks a provider, this screen asks WHO will actually connect it:
//   • "I'll connect it now"  (self)     → branches by provider.authMethod:
//       - 'redirect'    (Gusto)     → no modal; /connecting (no 2FA)
//       - 'credentials' (Principal) → user+password modal; /connecting?&2fa=1 (2FA)
//       - 'sftp'        (SFTP)      → host+user+password modal; /connecting (no 2FA)
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

  // Credential-entry modal state (self path). Exploratory probe — for
  // credentials/sftp providers the self OptionRow opens this instead of
  // navigating straight to /connecting.
  const [open, setOpen] = useState(false);
  const [host, setHost] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!provider) {
      router.replace('/select-provider');
    }
  }, [provider, router]);

  if (!provider) {
    return null;
  }

  const { name, slug, authMethod } = provider;
  const isSftp = authMethod === 'sftp';

  // 'redirect' goes straight to /connecting (no modal); 'credentials'/'sftp'
  // collect details in the modal first. Only 'credentials' carries &2fa=1
  // (→ /verify); the others go Establishing → Success straight.
  const handleSelfClick = () => {
    if (authMethod === 'redirect') {
      router.push(`/connecting?provider=${slug}`);
    } else {
      setOpen(true);
    }
  };
  const handleConnect = () => {
    const suffix = authMethod === 'credentials' ? '&2fa=1' : '';
    router.push(`/connecting?provider=${slug}${suffix}`);
  };

  return (
    <>
      <FlowLayout maxWidth={440} px={4} py={4}>
        <Stack spacing={2}>
          <Stack spacing={2} sx={{ alignItems: 'center', textAlign: 'center' }}>
            <FetchLogo size={40} />
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
            onClick={handleSelfClick}
          />
          <OptionRow
            title="Someone on my team manages it"
            description="We’ll send them a secure link to connect"
            onClick={() => router.push(`/invite?provider=${slug}`)}
          />
        </Stack>
      </FlowLayout>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth={false}
        slotProps={{
          paper: {
            sx: {
              bgcolor: 'background.paper',
              // MUI multiplies a numeric borderRadius by theme.shape.borderRadius
              // (= tokens.radius.lg); this ratio yields exactly tokens.radius.lg px.
              borderRadius: tokens.radius.lg / tokens.radius.lg,
              p: 4,
              width: 440,
              maxWidth: '100%',
            },
          },
        }}
      >
        <Stack spacing={2.5}>
          <Stack spacing={1}>
            <Typography variant="h5" component="h2" sx={{ color: 'text.primary' }}>
              {isSftp ? 'Connect via SFTP' : `Sign in to ${name}`}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {isSftp
                ? 'Enter your SFTP host and credentials.'
                : `Enter your ${name} credentials to connect. Read-only access.`}
            </Typography>
          </Stack>

          {isSftp && (
            <Input
              label="Host"
              placeholder="sftp.example.com"
              value={host}
              onChange={(e) => setHost(e.target.value)}
            />
          )}
          <Input
            label="Username or email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button onClick={handleConnect} sx={{ width: '100%' }}>
            Connect
          </Button>
          <Stack sx={{ alignItems: 'center' }}>
            <Link onClick={() => setOpen(false)}>Cancel</Link>
          </Stack>
        </Stack>
      </Dialog>
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ConnectMethodContent />
    </Suspense>
  );
}
