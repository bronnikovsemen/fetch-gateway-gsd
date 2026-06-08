'use client';

import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { tokens } from '@/theme/theme';

// OptionRow — Figma node 426:78. A selectable row built on Card + CardActionArea.
//   left: medium-weight title (text.primary) + optional caption description
//   right: chevron glyph (navy when selected).
// Interactive color is navy (secondary.main) per the confirmed Figma decision —
// hover paints a 1px navy border + soft purple-tinted elevation; selected paints
// a 2px navy border. All colors/spacing flow through the theme + DS tokens; the
// off-scale Figma 10px radius rounds to tokens.radius.lg (12), the nearest token.

export type OptionRowProps = {
  title: string;
  description?: string;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

export function OptionRow({ title, description, selected = false, disabled = false, onClick }: OptionRowProps) {
  const borderWidth = selected ? 2 : 1;

  return (
    <Card
      elevation={0}
      sx={{
        width: '100%',
        bgcolor: 'background.paper',
        borderRadius: tokens.radius.lg / tokens.radius.lg,
        border: `${borderWidth}px solid`,
        borderColor: selected ? 'secondary.main' : 'divider',
        opacity: disabled ? 0.5 : 1,
        transition: 'border-color 120ms ease, box-shadow 120ms ease',
        '&:hover': disabled || selected
          ? undefined
          : {
              borderColor: 'secondary.main',
              boxShadow: '0px 2px 4px rgba(92, 102, 242, 0.18)',
            },
      }}
    >
      <CardActionArea
        disabled={disabled}
        onClick={onClick}
        sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2 }}
      >
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.25, minWidth: 0 }}>
          <Typography sx={{ ...tokens.text.body2Medium, color: 'text.primary' }}>{title}</Typography>
          {description ? (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {description}
            </Typography>
          ) : null}
        </Box>
        <ChevronRightIcon sx={{ color: selected ? 'secondary.main' : 'text.secondary' }} />
      </CardActionArea>
    </Card>
  );
}

export default OptionRow;
