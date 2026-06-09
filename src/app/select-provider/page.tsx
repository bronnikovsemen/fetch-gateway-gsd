'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
import FetchLogo from '@/components/FetchLogo';
import Button from '@/components/Button';
import { Input } from '@/components/Input';
import providers, { type Provider } from '@/lib/providers';
import { tokens } from '@/theme/theme';

// `/select-provider` — third screen of the Pre-Provider Flow.
//   - Page background + white panel surface sourced from the theme
//   - Centered white 440px panel, DS radius, soft shadow
//   - Fetch logo at the top of the card
//   - Heading + subtitle
//   - DS Input in `select` mode (label "Connection", chevron-down, white/bordered)
//     listing Gusto / Principal / SFTP — replaces the old tonal MUI Select.
//   - Back (tonal) + Continue (brand-accent) buttons.
//     Continue is disabled until a provider is chosen.
//
// Loading-state submit (FLOW-05): when a provider is chosen and Continue
// is clicked, the button swaps into an inline CircularProgress for ~1.2s with
// both buttons + the dropdown disabled, then navigates to
// /connect-method?provider={slug}. The pending setTimeout is held in a ref and
// cleared by the useEffect cleanup if the user unmounts mid-flight.

export default function Page() {
  const router = useRouter();
  const [selected, setSelected] = useState<Provider['slug'] | ''>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const handleBack = () => router.push('/permissions');

  const handleConnect = () => {
    if (!selected || submitting) return;
    setSubmitting(true);
    timerRef.current = setTimeout(() => {
      router.push(`/connect-method?provider=${selected}`);
    }, 1200);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: 440,
          maxWidth: '100%',
          bgcolor: 'background.paper',
          borderRadius: tokens.radius.lg / tokens.radius.lg,
          boxShadow: '0 2px 2px rgba(99, 91, 255, 0.05)',
          px: tokens.space[8] / 8,
          py: 4.5,
        }}
      >
        <Stack spacing={4.5} sx={{ alignItems: 'center' }}>
          <FetchLogo size={40} />

          <Stack spacing={1} sx={{ width: '100%', textAlign: 'center' }}>
            <Typography variant="h5" component="h1" sx={{ color: 'text.primary' }}>
              What do you want to connect?
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Choose the system you want to connect
            </Typography>
          </Stack>

          <Box sx={{ width: '100%' }}>
            <Input
              select
              label="Connection"
              value={selected}
              onChange={(e) => setSelected(e.target.value as Provider['slug'] | '')}
              disabled={submitting}
            >
              {providers.map((p) => (
                <MenuItem key={p.slug} value={p.slug}>
                  {p.name}
                </MenuItem>
              ))}
            </Input>
          </Box>

          <Stack direction="row" spacing={1.5} sx={{ width: '100%', justifyContent: 'center' }}>
            <Button
              variant="secondary"
              onClick={handleBack}
              disabled={submitting}
              sx={{ width: 120, flexShrink: 0 }}
            >
              Back
            </Button>
            <Button
              onClick={handleConnect}
              disabled={!selected}
              loading={submitting}
              sx={{ flex: 1 }}
            >
              Continue
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
