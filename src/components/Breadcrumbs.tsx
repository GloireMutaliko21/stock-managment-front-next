import { Stack } from '@mui/material';
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import * as React from 'react';

interface BreadcrumbProps {
  children: React.ReactNode;
  module?: string;
}

const Breadcrumbs: React.FC<React.PropsWithChildren<BreadcrumbProps>> = ({ children, module }) => {
  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/">
      Accueil
    </Link>,
    <Link underline="hover" key="2" color="inherit">
      {module}
    </Link>,
    <Typography key="3" color="text.primary">
      {children}
    </Typography>,
  ];

  return (
    <Stack>
      <Typography variant="h6">{children}</Typography>
      <MuiBreadcrumbs separator="›" aria-label="breadcrumb">
        {breadcrumbs}
      </MuiBreadcrumbs>
    </Stack>
  );
};

export default Breadcrumbs;
