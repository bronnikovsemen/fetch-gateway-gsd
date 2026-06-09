'use client';

import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import FetchLogo from '@/components/FetchLogo';
import PermissionItem from '@/components/PermissionItem';
import Button from '@/components/Button';
import { tokens } from '@/theme/theme';

// `/permissions` — second screen of the Pre-Provider Flow.
//   - Page background + white panel surface sourced from the theme
//   - Centered white 768px panel, DS radius, 48px horizontal / 36px vertical padding
//   - 2-column column-major grid of 6 permissions (Org/Team/Employment | Payroll/Statement/SSN)
//   - Equal-width Back (tonal) and Continue (brand-accent) buttons

const PERMISSIONS = [
  { label: 'Organization', description: 'Business profile and banking information' },
  { label: 'Team', description: 'Roster of people and reporting structure' },
  { label: 'Employment', description: 'Employment status, role, and compensation' },
  { label: 'Payroll', description: 'Payments made to employees and contractors' },
  { label: 'Pay Statement', description: 'Itemized pay statements per employee' },
  { label: 'SSN', description: 'Social Security Numbers for tax reporting' },
] as const satisfies readonly { label: string; description: string }[];

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
            width: 640,
            maxWidth: '100%',
            bgcolor: 'background.paper',
            borderRadius: tokens.radius.sm / tokens.radius.lg,
            boxShadow: '0 2px 2px rgba(99, 91, 255, 0.05)',
            p: tokens.space[7] / 8,
          }}
        >
          <Stack spacing={6} sx={{ alignItems: 'stretch' }}>
            <Stack spacing={6} sx={{ alignItems: 'center' }}>
              <FetchLogo size={40} />
              <Typography
                variant="h5"
                component="h1"
                sx={{ color: 'text.primary', textAlign: 'center', width: '100%' }}
              >
                Fetch will need access to:
              </Typography>
            </Stack>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gridTemplateRows: 'repeat(3, auto)',
                gridAutoFlow: 'column',
                columnGap: 4,
                rowGap: 2.5,
              }}
            >
              {PERMISSIONS.map((perm) => (
                <PermissionItem key={perm.label} label={perm.label} description={perm.description} />
              ))}
            </Box>

            <Stack direction="row" spacing={2}>
              <Button
                variant="secondary"
                onClick={() => router.push('/welcome')}
                sx={{ width: 120, flexShrink: 0 }}
              >
                Back
              </Button>
              <Button
                onClick={() => router.push('/select-provider')}
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
