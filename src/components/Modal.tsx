import { useTypedSelector } from '@/hooks/useTypedSelector';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import ShopIcon from '@mui/icons-material/Store';
import { LoadingButton } from '@mui/lab';
import { alpha, Stack, useTheme } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { onCloseModal, onLoading } from 'features/modal';
import React, { PropsWithChildren } from 'react';
import { useDispatch } from 'react-redux';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CustomModal = ({
  children,
  title,
  size = 'md',
  onSubmit,
  primaryActionLabel,
}: PropsWithChildren<{
  size: 'sm' | 'md' | 'lg' | 'xl';
  children: any;
  title?: string;
  onSubmit: () => void;
  primaryActionLabel?: string;
}>) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const { isOpen, loading } = useTypedSelector((state) => state.modal);
  const handleClose = () => {
    dispatch(onCloseModal());
    dispatch(onLoading(false));
  };

  return (
    <Dialog
      onClose={handleClose}
      scroll="paper"
      aria-labelledby="customized-dialog-title"
      fullScreen={fullScreen}
      TransitionComponent={Transition}
      keepMounted
      maxWidth={size}
      fullWidth={true}
      open={isOpen}
    >
      <DialogTitle id="customized-dialog-title">
        <Stack direction="row" spacing={2} alignItems="center">
          <Stack
            sx={{
              width: 'max-content',
              height: 'max-content',
              borderRadius: 100,
              p: 1,
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
            }}
          >
            <ShopIcon fontSize="small" color="primary" />
          </Stack>
          <Typography variant="h6" noWrap sx={{ pr: 4 }}>
            {title}
          </Typography>
        </Stack>

        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} variant="outlined" color="primary" sx={{ py: 1, px: 4 }}>
          Annuler
        </Button>
        <LoadingButton
          size="small"
          loading={loading}
          {...(!primaryActionLabel && { startIcon: <SaveIcon /> })}
          onClick={onSubmit}
          variant="contained"
          disableElevation
          sx={{ py: 1.2, px: 2 }}
        >
          {primaryActionLabel ? primaryActionLabel : 'Enregistrer'}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default CustomModal;
