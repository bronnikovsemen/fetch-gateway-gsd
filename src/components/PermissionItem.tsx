import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
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
        <CheckCircleIcon sx={{ color: 'primary.main', fontSize: 16 }} />
        <Typography sx={{ ...tokens.text.body2Medium, color: 'text.primary' }}>
          {label}
        </Typography>
      </Stack>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        {description}
      </Typography>
    </Stack>
  );
}

export default PermissionItem;
