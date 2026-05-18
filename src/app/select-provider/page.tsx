'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import type { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FetchLogo from '@/components/FetchLogo';
import providers, { type Provider } from '@/lib/providers';

// `/select-provider` — third screen of the Pre-Provider Flow.
// Layout per Phase 1 Figma node 1931:13600:
//   - Light-blue page background (#F3FCFF)
//   - Centered white panel, 6px radius, soft purple-tinted shadow,
//     48px horizontal / 36px vertical padding, 36px vertical gap between sections
//   - Fetch logo (64px) at the top of the card
//   - Heading + subtitle (8px gap)
//   - 402px input field block: bold static label above a light-blue Select with
//     a chevron-down trailing icon
//   - Back (100px, light-blue) + Get Started (flex-1, brand-blue) buttons.
//     Get Started is disabled (30% opacity) until a provider is chosen.
//
// Loading-state submit (FLOW-05): when a provider is chosen and Get Started
// is clicked, the button swaps into an inline CircularProgress for ~1.2s with
// both buttons + Select disabled, then navigates to /connecting?provider={slug}.
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
      router.push(`/connecting?provider=${selected}`);
    }, 1200);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#F3FCFF',
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
          bgcolor: '#FFFFFF',
          borderRadius: '6px',
          boxShadow: '0 2px 2px rgba(134, 53, 246, 0.05)',
          px: '48px',
          py: '36px',
        }}
      >
        <Stack spacing={4.5} sx={{ alignItems: 'center' }}>
          <FetchLogo size={64} />

          <Stack spacing={1} sx={{ width: '100%', textAlign: 'center' }}>
            <Typography
              component="h1"
              sx={{ fontWeight: 600, fontSize: 24, color: '#001639', lineHeight: 'normal' }}
            >
              Select your payroll provider
            </Typography>
            <Typography sx={{ fontSize: 14, color: '#6B7281', lineHeight: 'normal' }}>
              Select the payroll system you want to connect
            </Typography>
          </Stack>

          <Box sx={{ width: 402, maxWidth: '100%' }}>
            <Typography
              id="provider-label"
              sx={{ fontWeight: 700, fontSize: 14, color: '#001639', mb: '4px' }}
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
                    <Typography component="span" sx={{ color: '#6B7281', fontSize: 14, fontWeight: 500 }}>
                      Payroll Provider
                    </Typography>
                  );
                }
                const provider = providers.find((p) => p.slug === value);
                return (
                  <Typography component="span" sx={{ color: '#001639', fontSize: 14, fontWeight: 500 }}>
                    {provider?.name ?? ''}
                  </Typography>
                );
              }}
              sx={{
                bgcolor: '#F3FCFF',
                height: 40,
                borderRadius: '6px',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#F3FCFF',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#005EFF',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#005EFF',
                },
                '& .MuiSelect-select': {
                  py: 0,
                  pl: '16px',
                  pr: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  minHeight: 'unset !important',
                },
                '& .MuiSelect-icon': {
                  color: '#001639',
                  right: 12,
                },
              }}
            >
              {providers.map((p) => (
                <MenuItem key={p.slug} value={p.slug} sx={{ fontSize: 14 }}>
                  {p.name}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Stack direction="row" spacing={3} sx={{ width: '100%', justifyContent: 'center' }}>
            <Button
              disableElevation
              onClick={handleBack}
              disabled={submitting}
              sx={{
                width: 100,
                flexShrink: 0,
                bgcolor: '#F3FCFF',
                color: '#001639',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: 14,
                minHeight: 40,
                borderRadius: '8px',
                px: '24px',
                py: '8px',
                '&:hover': { bgcolor: '#E5F4FE' },
                '&.Mui-disabled': { color: '#001639', opacity: 0.5 },
              }}
            >
              Back
            </Button>
            <Button
              disableElevation
              variant="contained"
              onClick={handleConnect}
              disabled={!selected || submitting}
              startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : undefined}
              sx={{
                flex: 1,
                bgcolor: '#005EFF',
                color: '#FFFFFF',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: 14,
                minHeight: 40,
                borderRadius: '8px',
                px: '24px',
                py: '8px',
                '&:hover': { bgcolor: '#004ACC' },
                '&.Mui-disabled': { bgcolor: '#005EFF', color: '#FFFFFF', opacity: 0.3 },
              }}
            >
              {submitting ? 'Redirecting…' : 'Get Started'}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
