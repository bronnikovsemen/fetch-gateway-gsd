import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FlowLayout from '@/components/FlowLayout';
import FetchLogo from '@/components/FetchLogo';

// Phase 1 placeholder for `/welcome`. The real welcome screen (heading,
// body copy, "Get Started" button → /permissions) lands in Phase 2
// (FLOW-02). This stub exists so the route is reachable end-to-end behind
// the shared FlowLayout chrome.

export default function Page() {
  return (
    <FlowLayout maxWidth={440}>
      <Stack spacing={3} sx={{ alignItems: 'center' }}>
        <FetchLogo />
        <Typography variant="h5">Welcome (`/welcome`)</Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          Phase 1 placeholder — real welcome screen lands in Phase 2 (FLOW-02).
        </Typography>
      </Stack>
    </FlowLayout>
  );
}
