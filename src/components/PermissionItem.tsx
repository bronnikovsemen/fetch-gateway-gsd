import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CheckRounded from '@mui/icons-material/CheckRounded';
import { alpha } from '@mui/material/styles';
import { tokens } from '@/theme/theme';

// PermissionItem — one cell of the /permissions 2-col grid.
//   row 1: small accent check icon + gap + medium-weight label (text.primary)
//   row 2: secondary-text description, aligned with the icon (no indent).
// All colors + type sizing flow through the MUI theme / DS tokens.

export type PermissionItemProps = {
  label: string;
  description: string;
};

export function PermissionItem({ label, description }: PermissionItemProps) {
  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Box
          sx={{
            width: 20,
            height: 20,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            // MUI multiplies a numeric borderRadius by shape.borderRadius
            // (= tokens.radius.lg); radius.full / radius.lg yields a full circle.
            borderRadius: tokens.radius.full / tokens.radius.lg,
            bgcolor: (t) => alpha(t.palette.primary.main, 0.12),
          }}
        >
          <CheckRounded sx={{ fontSize: 13, color: 'primary.main' }} />
        </Box>
        <Typography sx={{ ...tokens.text.body2Medium, color: 'text.primary' }}>
          {label}
        </Typography>
      </Stack>
      <Typography variant="caption" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
        {description}
      </Typography>
    </Stack>
  );
}

export default PermissionItem;
