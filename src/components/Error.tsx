import { Stack, Typography } from '@mui/material';
import React from 'react';
import ErrorIcon from '@mui/icons-material/Error';
import { toast } from 'react-toastify';

const Error = ({ error }: { error: string }) => {
  toast.error(error);
  return (
    <Stack sx={{ width: 1, height: '80vh' }} spacing={2} justifyContent="center" alignItems="center">
      <ErrorIcon sx={{ fontSize: 72 }} />
      <Typography>{error}</Typography>
    </Stack>
  );
};

export default Error;
