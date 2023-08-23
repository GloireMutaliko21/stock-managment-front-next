import Empty from '@/components/Empty';
import { cartAtom, finaliseAtom, loadingCartAtom, showCartAtom, totalCartAtom } from '@/features/cart';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { LoadingButton } from '@mui/lab';
import { Button } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import Slide from '@mui/material/Slide';
import Stack from '@mui/material/Stack';
import { TransitionProps } from '@mui/material/transitions';
import Typography from '@mui/material/Typography';
import { GridActionsCellItem, GridColumns, GridRowParams } from '@mui/x-data-grid';
import { useAtom } from 'jotai';
import React, { useMemo } from 'react';
import { currency } from '../../lib/currency';
import ItemsList from './ItemsList';

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

const options = {
  disableColumnMenu: true,
  flex: 1,
};

const CartItems = () => {
  const [loading, _setLoading] = useAtom(loadingCartAtom);
  const [cart, setCart] = useAtom(cartAtom);
  const [finalise, setFinalise] = useAtom(finaliseAtom);
  const [total, _setTotal] = useAtom(totalCartAtom);
  const [showCart, setShowCart] = useAtom(showCartAtom);

  function removeFromCart(item: Cart) {
    setCart((prev) => prev.filter((i) => i.id !== item.id));
  }

  function removeAll() {
    setCart([]);
  }

  function onSubmit() {
    setFinalise(true);
  }

  const rows = cart.map((item) => ({
    id: item.id,
    name: item.product?.name,
    quantity: item.quantity,
    price: currency.format(+item.sellingPrice),
    total: currency.format(+item.sellingPrice * +item.quantity),
  }));

  const columns = useMemo<GridColumns<any>>(
    () => [
      { ...options, field: 'name', headerName: 'Nom du produit', minWidth: 150 },
      { ...options, field: 'quantity', headerName: 'Quantité', minWidth: 80 },
      { ...options, field: 'price', headerName: 'Prix unitaire', minWidth: 100 },
      { ...options, field: 'total', headerName: 'Total', minWidth: 100 },
      {
        ...options,
        field: 'actions',
        headerName: 'Action',
        headerAlign: 'center',
        type: 'actions',
        align: 'center',
        width: 120,
        flex: 0,
        getActions: (params: GridRowParams<Cart>) => [
          // @ts-ignore
          <GridActionsCellItem
            key="voir"
            icon={<RemoveCircleIcon color="error" />}
            label="Mise en stock"
            onClick={() => removeFromCart(params.row)}
          />,
        ],
      },
    ],
    [showCart]
  );

  return (
    <>
      {cart.length ? (
        <React.Fragment>
          <DialogContent dividers>
            <ItemsList rows={rows} columns={columns} />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Stack width={1} spacing={2}>
              <Stack width={1} direction="row" justifyContent="space-between">
                <Typography variant="h6">Total général</Typography>
                <Typography variant="h6">{currency.format(total)}</Typography>
              </Stack>
              <Divider />
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button color="secondary" onClick={removeAll} variant="outlined" disableElevation>
                  Vider le panier
                </Button>
                <LoadingButton
                  size="small"
                  loading={loading}
                  onClick={onSubmit}
                  variant="contained"
                  disableElevation
                  sx={{ py: 1, px: 2 }}
                >
                  Finaliser la vente
                </LoadingButton>
              </Stack>
            </Stack>
          </DialogActions>
        </React.Fragment>
      ) : (
        <Empty />
      )}
    </>
  );
};

export default CartItems;
