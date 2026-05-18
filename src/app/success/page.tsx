import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FlowLayout from '@/components/FlowLayout';
import FetchLogo from '@/components/FetchLogo';

// Phase 1 placeholder for `/success`. The real confirmation panel
// (green checkmark + "Connected successfully" heading + "Done" button)
// lands in Phase 4 (FLOW-08). This stub exists so the route is reachable
// end-to-end behind the shared FlowLayout chrome.

export default function Page() {
  return (
    <FlowLayout maxWidth={440}>
      <Stack spacing={3} sx={{ alignItems: 'center' }}>
        <FetchLogo />
        <Typography variant="h5">Success (`/success`)</Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          Phase 1 placeholder — confirmation panel lands in Phase 4 (FLOW-08).
        </Typography>
      </Stack>
    </FlowLayout>
  );
}
