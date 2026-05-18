import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Temporary proof-of-life placeholder.
// Plan 01-03 Task 1 replaces this with the real `/` splash stub
// wrapped in FlowLayout.
export default function Home() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography variant="h4" color="primary">
        Fetch Gateway — foundation online
      </Typography>
    </Box>
  );
}
