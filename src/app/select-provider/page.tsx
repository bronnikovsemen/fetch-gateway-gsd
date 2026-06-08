'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import type { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FetchLogo from '@/components/FetchLogo';
import Button from '@/components/Button';
import providers, { type Provider } from '@/lib/providers';
import { tokens } from '@/theme/theme';

// `/select-provider` — third screen of the Pre-Provider Flow.
//   - Page background + white panel surface sourced from the theme
//   - Centered white panel, DS radius, soft shadow,
//     48px horizontal / 36px vertical padding
//   - Fetch logo at the top of the card
//   - Heading + subtitle
//   - 402px input field block: bold static label above a tonal Select with
//     a chevron-down trailing icon
//   - Back (tonal) + Get Started (brand-accent) buttons.
//     Get Started is disabled until a provider is chosen.
//
// Loading-state submit (FLOW-05): when a provider is chosen and Get Started
// is clicked, the button swaps into an inline CircularProgress for ~1.2s with
// both buttons + Select disabled, then navigates to /connect-method?provider={slug}.
// The pending setTimeout is held in a ref and cleared by the useEffect cleanup
// if the user unmounts mid-flight (T-03-01-01 mitigation).

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

  const handleChange = (event: SelectChangeEvent<Provider['slug'] | ''>) => {
    setSelected(event.target.value as Provider['slug'] | '');
  };

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
          width: 498,
          maxWidth: '100%',
          bgcolor: 'background.paper',
          borderRadius: tokens.radius.sm / tokens.radius.lg,
          boxShadow: '0 2px 2px rgba(99, 91, 255, 0.05)',
          px: tokens.space[8] / 8,
          py: 4.5,
        }}
      >
        <Stack spacing={4.5} sx={{ alignItems: 'center' }}>
          <FetchLogo size={64} />

          <Stack spacing={1} sx={{ width: '100%', textAlign: 'center' }}>
            <Typography variant="h5" component="h1" sx={{ color: 'text.primary' }}>
              Select your payroll provider
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Select the payroll system you want to connect
            </Typography>
          </Stack>

          <Box sx={{ width: 402, maxWidth: '100%' }}>
            <Typography
              id="provider-label"
              variant="body2"
              sx={{ fontWeight: 700, color: 'text.primary', mb: tokens.space[0] / 8 }}
            >
              Select Payroll Provider
            </Typography>
            <Select
              fullWidth
              value={selected}
              onChange={handleChange}
              displayEmpty
              disabled={submitting}
              IconComponent={KeyboardArrowDownIcon}
              inputProps={{ 'aria-labelledby': 'provider-label' }}
              MenuProps={{ disablePortal: true, keepMounted: true }}
              renderValue={(value) => {
                if (!value) {
                  return (
                    <Typography component="span" sx={{ ...tokens.text.body2Medium, color: 'text.secondary' }}>
                      Payroll Provider
                    </Typography>
                  );
                }
                const provider = providers.find((p) => p.slug === value);
                return (
                  <Typography component="span" sx={{ ...tokens.text.body2Medium, color: 'text.primary' }}>
                    {provider?.name ?? ''}
                  </Typography>
                );
              }}
              sx={{
                bgcolor: 'action.hover',
                height: 40,
                borderRadius: tokens.radius.sm / tokens.radius.lg,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'transparent',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                },
                '& .MuiSelect-select': {
                  py: 0,
                  pl: tokens.space[3] / 8,
                  pr: tokens.space[3] / 8,
                  display: 'flex',
                  alignItems: 'center',
                  minHeight: 'unset !important',
                },
                '& .MuiSelect-icon': {
                  color: 'text.primary',
                  right: 12,
                },
              }}
            >
              {providers.map((p) => (
                <MenuItem key={p.slug} value={p.slug} sx={{ ...tokens.text.body2Medium }}>
                  {p.name}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Stack direction="row" spacing={3} sx={{ width: '100%', justifyContent: 'center' }}>
            <Button
              variant="secondary"
              onClick={handleBack}
              disabled={submitting}
              sx={{ width: 100, flexShrink: 0 }}
            >
              Back
            </Button>
            <Button
              onClick={handleConnect}
              disabled={!selected}
              loading={submitting}
              sx={{ flex: 1 }}
            >
              {submitting ? 'Continue…' : 'Continue'}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
