import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FlowLayout from '@/components/FlowLayout';
import FetchLogo from '@/components/FetchLogo';
import providers from '@/lib/providers';

// Phase 1 placeholder for `/select-provider`. The real MUI Select dropdown +
// Back/Connect buttons land in Phase 3 (FLOW-04). This stub maps over the
// default-imported providers catalog and renders each name as a Typography
// line — a smoke test for FOUND-07 proving the catalog import is wired
// end-to-end. This is NOT the real Select component.

export default function Page() {
  return (
    <FlowLayout maxWidth={498}>
      <Stack spacing={3} sx={{ alignItems: 'center' }}>
        <FetchLogo />
        <Typography variant="h5">Select Provider (`/select-provider`)</Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          Phase 1 placeholder — MUI Select dropdown lands in Phase 3 (FLOW-04).
        </Typography>
        <Stack spacing={1} sx={{ alignItems: 'center' }}>
          {providers.map((p) => (
            <Typography key={p.slug} variant="body2">
              {p.name}
            </Typography>
          ))}
        </Stack>
      </Stack>
    </FlowLayout>
  );
}
