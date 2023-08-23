import React from 'react';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import { alpha, IconButton, Paper, Stack, Typography, Menu, MenuItem } from '@mui/material';
import { PropsWithChildren } from 'react';

interface Props {
  title: string;
  description: string;
  onEdit(): void;
  isMenu?: boolean;
}

const ConfigCard = ({ children, title, description, onEdit, isMenu }: PropsWithChildren<Props>) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Paper
      variant="outlined"
      sx={{
        py: 3,
        px: 2,
        borderRadius: 0,
        position: 'relative',
        '&:hover': {
          boxShadow: '0 5px 10px 0 rgba(0,0,0,0.1)',
        },
      }}
    >
      {isMenu ? (
        <>
          <IconButton sx={{ position: 'absolute', right: 10, top: 10 }} onClick={handleClick}>
            <DriveFileRenameOutlineIcon fontSize="small" />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem
              onClick={() => {
                onEdit();
                handleClose();
              }}
            >
              Modifier
            </MenuItem>
            <MenuItem onClick={handleClose}>Action 2</MenuItem>
            <MenuItem onClick={handleClose}>Action 3</MenuItem>
          </Menu>
        </>
      ) : (
        <IconButton sx={{ position: 'absolute', right: 10, top: 10 }} onClick={onEdit}>
          <DriveFileRenameOutlineIcon fontSize="small" />
        </IconButton>
      )}

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
      <Typography textAlign="center" color="text.secondary" noWrap>
        {description}
      </Typography>
    </Paper>
  );
};

export default ConfigCard;
