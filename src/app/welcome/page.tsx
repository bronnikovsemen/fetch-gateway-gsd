'use client';

import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import FetchLogo from '@/components/FetchLogo';
import Button from '@/components/Button';
import { tokens } from '@/theme/theme';

// `/welcome` — first screen of the Pre-Provider Flow.
//   - Page background + white panel surface sourced from the theme
//   - Centered 440px panel, DS radius, soft shadow, 48px uniform padding,
//     48px vertical gap between sections
//   - Fetch logo, heading + body block, full-width brand-accent Get Started CTA.

export default function Page() {
  const router = useRouter();

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
          borderRadius: tokens.radius.sm / tokens.radius.lg,
          boxShadow: '0 2px 2px rgba(99, 91, 255, 0.05)',
          p: tokens.space[8] / 8,
        }}
      >
        <Stack spacing={6} sx={{ alignItems: 'center' }}>
          <FetchLogo size={64} />

          <Stack spacing={2} sx={{ width: '100%', textAlign: 'center' }}>
            <Typography variant="h5" component="h1" sx={{ color: 'text.primary' }}>
              Connect your payroll provider
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Plantegrity has requested a secure read-only connection to your payroll data for plan validation and reconciliation. No data will be modified.
            </Typography>
          </Stack>

          <Button fullWidth onClick={() => router.push('/permissions')}>
            Get Started
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
