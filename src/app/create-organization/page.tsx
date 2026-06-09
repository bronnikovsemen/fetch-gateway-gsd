'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FlowLayout from '@/components/FlowLayout';
import FetchLogo from '@/components/FetchLogo';
import Input from '@/components/Input';
import Button from '@/components/Button';

// `/create-organization` — AUTH-02 (Figma 460:214). Reached from /sign-up
// (default, no ?org). Mocked: "Create organization" navigates to `/` (the
// splash stands in for the app landing per spec).
export default function Page() {
  const router = useRouter();
  const [orgName, setOrgName] = useState('');

  return (
    <FlowLayout maxWidth={400} px={4} py={4}>
      <Stack spacing={3} sx={{ alignItems: 'center' }}>
        <FetchLogo size={40} />
        <Typography variant="h5" component="h1" sx={{ color: 'text.primary', textAlign: 'center' }}>
          Create your organization
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
          We couldn’t find an organization for acme.com. Set one up to get started.
        </Typography>

        <Input
          label="Organization name"
          placeholder="Acme Inc."
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
        />

        <Button variant="primary" sx={{ width: '100%' }} onClick={() => router.push('/')}>
          Create organization
        </Button>
      </Stack>
    </FlowLayout>
  );
}
