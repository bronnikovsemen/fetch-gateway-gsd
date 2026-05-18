'use client';

import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import FetchLogo from '@/components/FetchLogo';

// `/welcome` — first screen of the Pre-Provider Flow.
// Layout per Phase 1 Figma node 1931:13455:
//   - Light-blue page background (#F3FCFF)
//   - Centered 440px white panel, 6px radius, soft purple-tinted shadow,
//     48px uniform padding, 48px vertical gap between sections
//   - Fetch logo (64px), heading + body block, full-width brand-blue
//     "Get Started" button.
// Not using FlowLayout because this page uses 6px radius + a different shadow
// spec than the shared component. FlowLayout drives the other pages.

export default function Page() {
  const router = useRouter();

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
          width: 440,
          maxWidth: '100%',
          bgcolor: '#FFFFFF',
          borderRadius: '6px',
          boxShadow: '0 2px 2px rgba(134, 53, 246, 0.05)',
          p: '48px',
        }}
      >
        <Stack spacing={6} sx={{ alignItems: 'center' }}>
          <FetchLogo size={64} />

          <Stack spacing={2} sx={{ width: '100%', textAlign: 'center' }}>
            <Typography
              component="h1"
              sx={{ fontWeight: 600, fontSize: 24, color: '#001639', lineHeight: 'normal' }}
            >
              Connect your payroll provider
            </Typography>
            <Typography sx={{ fontSize: 14, color: '#6B7281', lineHeight: 1.5 }}>
              Plantegrity has requested a secure read-only connection to your payroll data for plan validation and reconciliation. No data will be modified.
            </Typography>
          </Stack>

          <Button
            disableElevation
            variant="contained"
            onClick={() => router.push('/permissions')}
            sx={{
              width: '100%',
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
            }}
          >
            Get Started
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
