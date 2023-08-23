import { alpha, Stack, Typography } from '@mui/material';

import DoNotTouchIcon from '@mui/icons-material/DoNotTouch';

const AccessDenied = () => {
  return (
    <Stack
      sx={{ width: 1, height: 1, minHeight: 400, position: 'relative' }}
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        sx={{
          width: 'max-content',
          height: 'max-content',
          borderRadius: 100,
          mx: 'auto',
          mb: 2,
          p: 3,
          bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
        }}
      >
        <DoNotTouchIcon sx={{ fontSize: 52 }} color="error" />
      </Stack>
      <Typography variant="h6" textAlign="center">
        Access Denied
      </Typography>
    </Stack>
  );
};

export default AccessDenied;
