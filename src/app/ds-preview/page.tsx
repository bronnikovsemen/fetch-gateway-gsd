'use client';

// DEV-ONLY preview page — NOT part of the v1/v2 flow, linked from nowhere, safe
// to delete. Renders every DS component variant/state for visual QA before v2
// wiring. Reached only by typing /ds-preview directly.

import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@/components/Button';
import { OptionRow } from '@/components/OptionRow';
import { Chip } from '@/components/Chip';
import { Input } from '@/components/Input';
import { Link } from '@/components/Link';

const SEVERITIES = ['warning', 'success', 'rejection', 'info', 'neutral'] as const;
const SIZES = ['small', 'medium'] as const;

export default function Page() {
  const [v1, setV1] = useState('');
  const [v2, setV2] = useState('');
  const [v3, setV3] = useState('');
  const [v4, setV4] = useState('');

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: 6 }}>
      <Stack spacing={6}>
        <Typography variant="h4">DS Preview</Typography>

        {/* 1. Button */}
        <Stack spacing={2}>
          <Typography variant="h5">Button</Typography>
          <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', alignItems: 'center' }}>
            <Button variant="primary" size="sm">Primary sm</Button>
            <Button variant="primary" size="md">Primary md</Button>
            <Button variant="primary" size="lg">Primary lg</Button>
            <Button variant="secondary" size="sm">Secondary sm</Button>
            <Button variant="secondary" size="md">Secondary md</Button>
            <Button variant="secondary" size="lg">Secondary lg</Button>
            <Button variant="primary" loading>Loading</Button>
            <Button variant="primary" disabled>Disabled</Button>
          </Stack>
        </Stack>

        {/* 2. OptionRow */}
        <Stack spacing={2}>
          <Typography variant="h5">OptionRow</Typography>
          <Stack spacing={2}>
            <Box sx={{ maxWidth: 440 }}>
              <OptionRow title="Default with description" description="This row has a caption description." />
            </Box>
            <Box sx={{ maxWidth: 440 }}>
              <OptionRow title="Default without description" />
            </Box>
            <Box sx={{ maxWidth: 440 }}>
              <OptionRow title="Selected" description="selected=true" selected />
            </Box>
            <Box sx={{ maxWidth: 440 }}>
              <OptionRow title="Disabled" description="disabled=true" disabled />
            </Box>
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            hover is live (mouse over)
          </Typography>
        </Stack>

        {/* 3. Chip */}
        <Stack spacing={2}>
          <Typography variant="h5">Chip</Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, max-content)',
              gap: 2,
              alignItems: 'center',
            }}
          >
            {SEVERITIES.map((severity) =>
              SIZES.map((size) => (
                <Chip
                  key={`${severity}-${size}`}
                  label={`${severity} ${size}`}
                  severity={severity}
                  size={size}
                />
              )),
            )}
          </Box>
        </Stack>

        {/* 4. Input */}
        <Stack spacing={2}>
          <Typography variant="h5">Input</Typography>
          <Stack spacing={2} sx={{ maxWidth: 440 }}>
            <Input
              label="Default with label"
              value={v1}
              onChange={(e) => setV1(e.target.value)}
              placeholder="Type here"
            />
            <Input
              value={v2}
              onChange={(e) => setV2(e.target.value)}
              placeholder="No label"
            />
            <Input
              label="Error field"
              value={v3}
              onChange={(e) => setV3(e.target.value)}
              error
              helperText="This field has an error"
            />
            <Input
              label="Disabled"
              value={v4}
              onChange={(e) => setV4(e.target.value)}
              disabled
            />
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            focus is live — click/tab to see navy focus border
          </Typography>
        </Stack>

        {/* 5. Link */}
        <Stack spacing={2}>
          <Typography variant="h5">Link</Typography>
          <Stack direction="row" spacing={3} sx={{ alignItems: 'center' }}>
            <Link size="sm" href="#">Link sm</Link>
            <Link size="md" href="#">Link md</Link>
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            hover underline is live
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}
