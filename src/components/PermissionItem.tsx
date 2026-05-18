import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// PermissionItem — one cell of the /permissions 2-col grid.
// Layout per Phase 1 Figma (node 1931:13485 and siblings):
//   row 1: 16px blue check icon + 8px gap + Roboto SemiBold 14px label (#001639)
//   row 2: Roboto Regular 12px description (#6B7281), starting at the left edge
//          (no indent under the label — the description aligns with the icon).
//   8px vertical gap between the two rows.

export type PermissionItemProps = {
  label: string;
  description: string;
};

export function PermissionItem({ label, description }: PermissionItemProps) {
  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <CheckCircleIcon sx={{ color: '#005EFF', fontSize: 16 }} />
        <Typography sx={{ fontWeight: 600, fontSize: 14, color: '#001639', lineHeight: 'normal' }}>
          {label}
        </Typography>
      </Stack>
      <Typography sx={{ fontSize: 12, color: '#6B7281', lineHeight: 1.4 }}>
        {description}
      </Typography>
    </Stack>
  );
}

export default PermissionItem;
