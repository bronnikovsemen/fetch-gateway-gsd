import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// PermissionItem — one row of the /permissions grid: a blue checkmark plus a
// bold label plus a muted description, laid out in a single horizontal row.
//
// Tokens consumed from the MUI theme:
//   - icon color   → 'primary.main'     (#2463EC, Fetch brand blue)
//   - label color  → 'text.primary'     (#101827)
//   - desc color   → 'text.secondary'   (#6B7280, spec-mandated muted)
// The bold (fontWeight 700) on the label is per the spec — the visual contrast
// between the bold label and the muted description is what makes the row
// scannable at the 2x3 grid scale used on /permissions.

export type PermissionItemProps = {
  label: string;
  description: string;
};

export function PermissionItem({ label, description }: PermissionItemProps) {
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{ alignItems: 'flex-start' }}
    >
      <CheckCircleIcon
        fontSize="small"
        sx={{ color: 'primary.main', mt: '2px' }}
      />
      <Box>
        <Typography
          variant="body1"
          sx={{ fontWeight: 700, color: 'text.primary' }}
        >
          {label}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {description}
        </Typography>
      </Box>
    </Stack>
  );
}

export default PermissionItem;
