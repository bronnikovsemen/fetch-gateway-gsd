'use client';

import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FlowLayout from '@/components/FlowLayout';
import FetchLogo from '@/components/FetchLogo';
import PermissionItem from '@/components/PermissionItem';

// `/permissions` — second real screen of the Pre-Provider Flow (FLOW-03).
// 768px white panel on the Fetch page background with 36px horizontal /
// 48px vertical padding via FlowLayout's px/py API (Plan 02-01). This is the
// SECOND consumer of that API and the FIRST to exercise the asymmetric SPLIT
// shape (px={4.5} py={6}) — the exact motivation for closing WR-02 in the
// Phase 1 REVIEW. Interior: Fetch logo, the spec heading, a 2-column grid of
// all six permission scopes in column-major spec order, and two side-by-side
// buttons — Back (outlined → /welcome) and Continue (primary → /select-provider).
// Both buttons use imperative `router.push` navigation, matching the pattern
// established by Plan 02-02 (splash auto-redirect) and Plan 02-03 (/welcome CTA).

const PERMISSIONS = [
  {
    label: 'Organization',
    description: 'Business profile, contact details, and banking information',
  },
  {
    label: 'Team',
    description: 'Roster of people and reporting structure',
  },
  {
    label: 'Employment',
    description: 'Employment status, contact details, role, and compensation',
  },
  {
    label: 'Payroll',
    description: 'Payments made to employees and contractors',
  },
  {
    label: 'Pay Statement',
    description: 'Itemized pay statements per employee',
  },
  {
    label: 'SSN',
    description: 'Social Security Numbers for tax reporting',
  },
] as const satisfies readonly { label: string; description: string }[];

export default function Page() {
  const router = useRouter();

  return (
    <FlowLayout maxWidth={768} px={4.5} py={6}>
      <Stack spacing={4} sx={{ alignItems: 'stretch' }}>
        <Stack spacing={3} sx={{ alignItems: 'center' }}>
          <FetchLogo size={100} />
          <Typography
            variant="h5"
            component="h1"
            sx={{ fontWeight: 700, color: 'text.primary', textAlign: 'center' }}
          >
            To connect your payroll, Fetch will need access to:
          </Typography>
        </Stack>
        {/* gridAutoFlow: 'column' so the 6 items column-fill into left=Org/Team/Employment, right=Payroll/Pay Statement/SSN per spec */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: 'repeat(3, auto)',
            gridAutoFlow: 'column',
            columnGap: 4,
            rowGap: 3,
          }}
        >
          {PERMISSIONS.map((perm) => (
            <PermissionItem
              key={perm.label}
              label={perm.label}
              description={perm.description}
            />
          ))}
        </Box>
        <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end', mt: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={() => router.push('/welcome')}
            sx={{ textTransform: 'none', fontWeight: 600, minWidth: 120 }}
          >Back</Button>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => router.push('/select-provider')}
            sx={{ textTransform: 'none', fontWeight: 600, minWidth: 160 }}
          >Continue</Button>
        </Stack>
      </Stack>
    </FlowLayout>
  );
}
