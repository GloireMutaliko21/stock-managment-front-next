import { loadingCartAtom, totalCartAtom } from '@/features/cart';
import CloseIcon from '@mui/icons-material/Close';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import { DialogActions, DialogContent, Divider, alpha, useTheme } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { TransitionProps } from '@mui/material/transitions';
import useMediaQuery from '@mui/material/useMediaQuery';
import { GridColumns } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { useAtom } from 'jotai';
import React, { useMemo } from 'react';
import { factureAtom, showFactureAtom } from '../../features/sales';
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

export interface Facture {
  amountDue: number;
  amountPaid: number;
  clientName: string;
  clientPhone: string;
  createdAt: string;
  description: string;
  id: string;
  products: {
    id: string;
    product: Product;
    quantity: number;
    sellingPrice: number;
  }[];
  reference: string;
  totalAmount: number;
  seller?: User;
  payment: Payment[];
}

interface Payment {
  id: string;
  amount: number;
  createdAt: string;
}

const options = {
  disableColumnMenu: true,
  flex: 1,
};

const FactureModal = () => {
  const [showFactureModal, setShowFactureModal] = useAtom(showFactureAtom);
  const [, _setLoading] = useAtom(loadingCartAtom);
  const [facture, setFacture] = useAtom(factureAtom);
  const [, _setTotal] = useAtom(totalCartAtom);
  const theme = useTheme();

  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  function handleClose() {
    setShowFactureModal(false);
  }

  const rows = facture?.products.map((item) => ({
    id: item.id,
    name: item.product.name,
    quantity: item.quantity,
    price: currency.format(item.sellingPrice),
    total: currency.format(item.sellingPrice * item.quantity),
  }));

  const columns = useMemo<GridColumns<any>>(
    () => [
      { ...options, field: 'name', headerName: 'Nom du produit', minWidth: 170 },
      { ...options, field: 'quantity', headerName: 'Quantité', minWidth: 100 },
      { ...options, field: 'price', headerName: 'Prix unitaire', minWidth: 100 },
      { ...options, field: 'total', headerName: 'Total', minWidth: 100 },
    ],
    [facture]
  );

  if (!facture) {
    return null;
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
      open={showFactureModal}
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
            <LocalMallIcon fontSize="small" color="primary" />
          </Stack>
          <Typography variant="h6" noWrap sx={{ pr: 4 }}>
            Details de la vente
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
        <Divider sx={{ my: 2 }} />
        <Stack spacing={1}>
          <Typography component="span">
            Référence :{' '}
            <Typography component="span" color="text.secondary">
              {facture.reference}
            </Typography>
          </Typography>

          <Typography component="span">
            Nom du client :{' '}
            <Typography component="span" color="text.secondary">
              {facture.clientName}
            </Typography>
          </Typography>

          <Typography component="span">
            Numéro du client :{' '}
            <Typography component="span" color="text.secondary">
              {facture.clientPhone}
            </Typography>
          </Typography>

          <Typography component="span">
            Date de facturation :{' '}
            <Typography component="span" color="text.secondary">
              {dayjs(facture.createdAt).locale('fr').format('L LT')}
            </Typography>
          </Typography>
          <Typography component="span">
            Description :{' '}
            <Typography component="span" color="text.secondary">
              {facture.description}
            </Typography>{' '}
          </Typography>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <ItemsList rows={rows} columns={columns} />
      </DialogContent>
      <DialogActions>
        <Stack alignItems="flex-end" sx={{ p: 2 }}>
          <Stack spacing={1} alignItems="flex-start">
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography>Total général :</Typography>
              <Typography color="text.secondary">{currency.format(facture.totalAmount)}</Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <Typography>Montant payé :</Typography>
              <Typography color="text.secondary">{currency.format(facture.amountPaid)}</Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <Typography>Montant restant :</Typography>
              <Typography color="text.secondary">{currency.format(facture.amountDue)}</Typography>
            </Stack>
          </Stack>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default FactureModal;
