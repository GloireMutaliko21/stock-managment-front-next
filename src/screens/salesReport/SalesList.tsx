/* eslint-disable react-hooks/exhaustive-deps */
import DataTable from '@/components/DataTable';
import Empty from '@/components/Empty';
import Error from '@/components/Error';
import { factureAtom, showFactureAtom, showPayeModalAtom } from '@/features/sales';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { currency } from '@/lib/currency';
import { AppDispatch } from '@/redux/store';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PaymentIcon from '@mui/icons-material/Payment';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { alpha, Stack, Typography } from '@mui/material';
import Chip from '@mui/material/Chip';
import { GridActionsCellItem, GridColumns, GridRenderCellParams, GridRowParams } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { useAtom } from 'jotai';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import FactureModal from './FactureModal';

import SummarizeIcon from '@mui/icons-material/Summarize';

const options = {
  hidable: false,
  filterable: false,
  sortable: true,
  flex: 0,
};

type Event = { target: { value: string; name: string } };

type ShowModal = {
  isOpen: boolean;
  data: any;
  modal: 'PAYMENT' | 'VIEW' | 'CANCEL' | null;
};

const SalesList = ({
  handlePageChange,
  handleOtherModal,
  pagination,
}: {
  handlePageChange(page: number): void;
  handleOtherModal(data: Product | null): void;
  pagination: { pageSize: number; page: number };
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { allSales, meta, status, error } = useTypedSelector((state) => state.getSales);
  const { isOpen } = useTypedSelector((state) => state.sidebar);
  const [showFactureModal, setShowFactureModal] = useAtom(showFactureAtom);
  const [showPayeModal, setShowPayeModal] = useAtom(showPayeModalAtom);
  const { page, pageSize } = pagination;
  const [facture, setFacture] = useAtom(factureAtom);
  const { currentUser } = useTypedSelector((state) => state.getCurrentUser);

  const rows =
    allSales &&
    allSales.map((sale) => ({
      ...sale,
      ...sale.facture,
      date: dayjs(sale.createdAt).locale('fr').format('L LT'),
    }));

  const handleShowFactureModal = React.useCallback(
    (sale: Sale) => async () => {
      setShowFactureModal(true);
      setFacture(sale.facture as any);
    },
    []
  );

  const handleShowPayeModal = React.useCallback(
    (sale: Sale) => async () => {
      setShowPayeModal(true);
      setFacture(sale.facture as any);
    },
    []
  );

  const getPaymentStatus = (dette: number) => {
    if (dette > 0) {
      return <Chip size="small" label="Impayée" icon={<PaymentIcon />} color="error" />;
    }
    return <Chip size="small" label="Payée" icon={<CheckCircleIcon />} color="success" />;
  };

  const columns = React.useMemo<GridColumns<Sale[]>>(
    () => [
      {
        ...options,
        field: 'avatar',
        headerName: 'Avatar',
        headerAlign: 'center',
        width: 80,
        renderCell: (params: GridRenderCellParams<any>) => (
          <Stack
            sx={{
              width: 'max-content',
              height: 'max-content',
              borderRadius: 100,
              mx: 'auto',
              p: 1,
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
            }}
          >
            <SummarizeIcon sx={{ fontSize: 24 }} color="primary" />
          </Stack>
        ),
      },
      { ...options, flex: 1, minWidth: 210, field: 'date', headerName: 'Date' },
      {
        ...options,
        field: 'reference',
        headerName: 'Référence',
        minWidth: 180,
      },
      {
        ...options,
        field: 'status',
        headerName: 'État de la facture',
        minWidth: 180,
        renderCell: (params: GridRenderCellParams<any>) => getPaymentStatus(params.row.facture.amountDue),
      },
      {
        ...options,
        field: 'clientName',
        headerName: 'Nom du client',
        minWidth: 180,
      },
      {
        ...options,
        field: 'clientPhone',
        headerName: 'Numéro du client',
        minWidth: 180,
      },
      {
        ...options,
        field: 'amountPaid',
        headerName: 'Montant payé',
        minWidth: 200,
        renderCell: (params: GridRenderCellParams<any>) => currency.format(params.row.facture.amountPaid),
      },
      {
        ...options,
        field: 'amountDue',
        headerName: 'Dette',
        minWidth: 200,
        renderCell: (params: GridRenderCellParams<any>) => (
          <Typography fontWeight={700} color={params.row.facture.amountDue > 0 ? 'error' : 'inherit'}>
            {currency.format(params.row.facture.amountDue)}
          </Typography>
        ),
      },
      {
        ...options,
        field: 'totalAmount',
        headerName: 'Prix total',
        minWidth: 200,
        renderCell: (params: GridRenderCellParams<any>) => currency.format(params.row.facture.totalAmount),
      },
      {
        ...options,
        field: 'actions',
        headerName: 'Actions',
        headerAlign: 'center',
        type: 'actions',
        align: 'center',
        width: 120,
        getActions: (params: GridRowParams<Sale>) => [
          // @ts-ignore
          <GridActionsCellItem
            icon={<RemoveRedEyeIcon color="info" />}
            label="Voir plus"
            onClick={handleShowFactureModal(params.row)}
          />,
          // @ts-ignore
          // <GridActionsCellItem
          //   icon={<PaymentIcon color="success" />}
          //   label="Payer la dette"
          //   onClick={handleShowPayeModal(params.row)}
          //   showInMenu
          //   disabled={params.row.facture.amountDue < 1 || currentUser?.user.role !== 'SUPER_ADMIN'}
          // />,
          // @ts-ignore
          // <GridActionsCellItem
          //   icon={<UTurnLeftIcon color="error" />}
          //   label="Rembourser la facture"
          //   // onClick={() => handleOtherModal(params.row)}
          //   showInMenu
          // />,
        ],
      },
    ],
    [isOpen]
  );

  if (error) return <Error error={error} />;
  if (status === 'success' && !allSales?.length) return <Empty />;

  return (
    <Stack sx={{ minHeight: '70vh', my: 3, bgcolor: 'background.paper', p: 0.5 }}>
      <FactureModal />
      <DataTable
        rowCount={meta?.count}
        page={page}
        rows={rows}
        pageSize={pageSize}
        handlePageChange={handlePageChange}
        columns={columns}
        loading={status !== 'success' ? true : false}
      />
    </Stack>
  );
};

export default SalesList;
