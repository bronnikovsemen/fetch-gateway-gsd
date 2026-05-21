'use client';

import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import FetchLogo from '@/components/FetchLogo';
import PermissionItem from '@/components/PermissionItem';
import Button from '@/components/Button';

// `/permissions` — second screen of the Pre-Provider Flow.
// Layout per Phase 1 Figma node 1931:13477 (header removed per latest direction):
//   - Light-blue page background (#F3FCFF)
//   - Centered white 768px panel, 6px radius, 48px horizontal / 36px vertical padding
//   - 2-column column-major grid of 6 permissions (Org/Team/Employment | Payroll/Statement/SSN)
//   - Equal-width Back (light-blue) and Continue (brand-blue #005EFF) buttons
// Not using FlowLayout because this page uses different tokens (6px radius, soft
// purple-tinted shadow) than the shared component. FlowLayout drives other pages.

const PERMISSIONS = [
  { label: 'Organization', description: 'Business profile, contact details, and banking information' },
  { label: 'Team', description: 'Roster of people and reporting structure' },
  { label: 'Employment', description: 'Employment status, contact details, role, and compensation' },
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
            width: 768,
            maxWidth: '100%',
            bgcolor: '#FFFFFF',
            borderRadius: '6px',
            boxShadow: '0 2px 2px rgba(134, 53, 246, 0.05)',
            px: '48px',
            py: '36px',
          }}
        >
          <Stack spacing={6} sx={{ alignItems: 'stretch' }}>
            <Stack spacing={6} sx={{ alignItems: 'center' }}>
              <FetchLogo size={64} />
              <Typography
                component="h1"
                sx={{
                  fontWeight: 600,
                  fontSize: 24,
                  color: '#001639',
                  textAlign: 'center',
                  width: '100%',
                }}
              >
                To connect your payroll, Fetch will need access to:
              </Typography>
            </Stack>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gridTemplateRows: 'repeat(3, auto)',
                gridAutoFlow: 'column',
                columnGap: 3,
                rowGap: 3,
              }}
            >
              {PERMISSIONS.map((perm) => (
                <PermissionItem key={perm.label} label={perm.label} description={perm.description} />
              ))}
            </Box>

            <Stack direction="row" spacing={3}>
              <Button
                variant="secondary"
                onClick={() => router.push('/welcome')}
                sx={{ flex: 1 }}
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
