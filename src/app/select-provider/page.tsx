'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import type { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import FlowLayout from '@/components/FlowLayout';
import FetchLogo from '@/components/FetchLogo';
import providers, { type Provider } from '@/lib/providers';

// `/select-provider` — the decision moment of the demo flow (FLOW-04 + FLOW-05).
// 498px white panel on the Fetch page background with 48px uniform padding
// (FlowLayout default px/py = 6/6). Interior: Fetch logo, the spec heading,
// the spec body copy, an MUI Select listing the four providers from the
// catalog (src/lib/providers.ts — single source of truth), and a Back
// (outlined → /permissions) + Connect (primary contained, flex-1) button row.
//
// Loading-state submit (FLOW-05): when a provider is chosen and Connect is
// clicked, the button swaps into an inline CircularProgress + a connecting
// label for ~1.2s, both buttons + FormControl are disabled, then the page
// navigates to /connecting?provider={slug}. The pending setTimeout is held in
// a ref and cleared by the useEffect cleanup if the user unmounts mid-flight
// (T-03-01-01 mitigation — no stale router.push on an unmounted component).
//
// Imperative navigation pattern: useRouter().push for both Back and Connect,
// canonicalized by Plans 02-02 / 02-03 / 02-04. WR-01/WR-02 nits about
// router.replace / router.back() are explicitly deferred per PROJECT.md.

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

  const handleBack = () => {
    router.push('/permissions');
  };

  const handleConnect = () => {
    if (!selected || submitting) return;
    setSubmitting(true);
    timerRef.current = setTimeout(() => { router.push(`/connecting?provider=${selected}`); }, 1200);
  };

  return (
    <FlowLayout maxWidth={498}>
      <Stack spacing={3} sx={{ alignItems: 'stretch' }}>
        <Stack spacing={3} sx={{ alignItems: 'center' }}>
          <FetchLogo size={100} />
          <Typography
            variant="h5"
            component="h1"
            sx={{ fontWeight: 700, color: 'text.primary', textAlign: 'center' }}
          >
            Select your payroll provider
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: 'text.secondary', textAlign: 'center' }}
          >
            Select the payroll system you want to connect
          </Typography>
        </Stack>
        <FormControl fullWidth disabled={submitting}>
          <InputLabel id="provider-select-label">Select Payroll Provider</InputLabel>
          <Select
            labelId="provider-select-label"
            id="provider-select"
            value={selected}
            label="Select Payroll Provider"
            onChange={handleChange}
            displayEmpty
            MenuProps={{ disablePortal: true, keepMounted: true }}
          >
            <MenuItem value="" disabled><em>Payroll Provider</em></MenuItem>
            {providers.map((p) => (
              <MenuItem key={p.slug} value={p.slug}>{p.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'stretch' }}>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={handleBack}
            disabled={submitting}
            sx={{ textTransform: 'none', fontWeight: 600, minWidth: 100, width: 100, flexShrink: 0 }}
          >Back</Button>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleConnect}
            disabled={!selected || submitting}
            sx={{ textTransform: 'none', fontWeight: 600, flex: 1 }}
            startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : undefined}
          >{submitting ? <>Connecting…</> : <>Connect</>}</Button>
        </Stack>
      </Stack>
    </FlowLayout>
  );
}
