import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import { alpha, Divider, IconButton, Paper, Stack, Typography } from '@mui/material';
import { PropsWithChildren } from 'react';
import Chip from '@mui/material/Chip';

interface Props {
  title: string;
  description: string;
  onEdit(): void;
  weighing: number;
  hoursNumber: number;
  teacher: string;
}

const ConfigCardSubjects = ({
  children,
  title,
  weighing,
  hoursNumber,
  teacher,
  description,
  onEdit,
}: PropsWithChildren<Props>) => {
  return (
    <Paper
      variant="outlined"
      sx={{
        py: 4,
        px: 2,
        borderRadius: 0,
        position: 'relative',
        '&:hover': {
          boxShadow: '0 5px 10px 0 rgba(0,0,0,0.1)',
        },
      }}
    >
      <IconButton sx={{ position: 'absolute', right: 10, top: 10 }} onClick={onEdit}>
        <DriveFileRenameOutlineIcon fontSize="small" />
      </IconButton>

      <Stack
        sx={{
          width: 'max-content',
          height: 'max-content',
          borderRadius: 100,
          mx: 'auto',
          mb: 2,
          p: 3,
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
        }}
      >
        {children}
      </Stack>
      <Typography textAlign="center" variant="h5" color="primary" fontWeight={700}>
        {title}
      </Typography>
      <Typography textAlign="center" color="text.secondary">
        {description}
      </Typography>
      <Typography textAlign="center" color="text.secondary" sx={{ bgcolor: 'action.hover', my: 2, p: 1 }}>
        Par {teacher}
      </Typography>

      <Stack spacing={2} direction="row" sx={{ width: 1, mb: 2 }} justifyContent="center">
        <Chip label={`Max: ${weighing}`} />
        <Chip label={`Heures: ${hoursNumber}`} />
      </Stack>
    </Paper>
  );
};

export default ConfigCardSubjects;
