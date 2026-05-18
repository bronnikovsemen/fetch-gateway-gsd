import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FlowLayout from '@/components/FlowLayout';
import FetchLogo from '@/components/FetchLogo';
import PermissionItem from '@/components/PermissionItem';

// Phase 1 placeholder for `/permissions`. The real 2x3 permissions grid +
// Back/Continue buttons land in Phase 2 (FLOW-03). This stub renders ONE
// sample PermissionItem as a smoke test for UI-03 — proving the component
// composes correctly inside FlowLayout.

export default function Page() {
  return (
    <FlowLayout maxWidth={768}>
      <Stack spacing={3} sx={{ alignItems: 'center' }}>
        <FetchLogo />
        <Typography variant="h5">Permissions (`/permissions`)</Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          Phase 1 placeholder — real permissions grid lands in Phase 2 (FLOW-03).
        </Typography>
        <PermissionItem
          label="Organization"
          description="Business profile, contact details, and banking information."
        />
      </Stack>
    </FlowLayout>
  );
}
