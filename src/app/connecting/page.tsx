import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FlowLayout from '@/components/FlowLayout';
import FetchLogo from '@/components/FetchLogo';

// Phase 1 placeholder for `/connecting`. The real spinner + provider-name
// copy + ?provider= query-param guard + auto-advance land in Phase 3
// (FLOW-06/07). This stub exists so the route is reachable end-to-end
// behind the shared FlowLayout chrome.

export default function Page() {
  return (
    <FlowLayout maxWidth={440}>
      <Stack spacing={3} sx={{ alignItems: 'center' }}>
        <FetchLogo />
        <Typography variant="h5">Connecting (`/connecting`)</Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          Phase 1 placeholder — spinner + query-param guard land in Phase 3 (FLOW-06/07).
        </Typography>
      </Stack>
    </FlowLayout>
  );
}
