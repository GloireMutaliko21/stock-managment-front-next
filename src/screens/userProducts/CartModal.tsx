import { cartAtom, finaliseAtom, loadingCartAtom, showCartAtom, totalCartAtom } from '@/features/cart';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { alpha, useTheme } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import Stack from '@mui/material/Stack';
import { TransitionProps } from '@mui/material/transitions';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useAtom } from 'jotai';
import React from 'react';
import CartItems from './CartItems';
import Checkout from './Checkout';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export interface Cart {
  id: string;
  product: Product | null;
  quantity: string;
  sellingPrice: string;
}

const CartModal = () => {
  const [showCart, setShowCart] = useAtom(showCartAtom);
  const [finalise, _] = useAtom(finaliseAtom);
  const [, _setLoading] = useAtom(loadingCartAtom);
  const [cart, setCart] = useAtom(cartAtom);
  const [, _setTotal] = useAtom(totalCartAtom);
  const theme = useTheme();

  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  function handleClose() {
    setShowCart(false);
  }

  return (
    <Dialog
      onClose={handleClose}
      scroll="body"
      aria-labelledby="customized-dialog-title"
      fullScreen={fullScreen}
      TransitionComponent={Transition}
      keepMounted
      maxWidth="sm"
      fullWidth={true}
      open={showCart}
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
            <ShoppingCartIcon fontSize="small" color="primary" />
          </Stack>
          <Typography variant="h6" noWrap sx={{ pr: 4 }}>
            Panier
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
      {finalise ? <Checkout /> : <CartItems />}
    </Dialog>
  );
};

export default CartModal;
