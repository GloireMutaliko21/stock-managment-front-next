import DataTable from '@/components/DataTable';
import Empty from '@/components/Empty';
import Error from '@/components/Error';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { currency } from '@/lib/currency';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HistoryIcon from '@mui/icons-material/History';
import PendingIcon from '@mui/icons-material/Pending';
import { alpha, Stack } from '@mui/material';
import Chip from '@mui/material/Chip';
import { GridColumns, GridRenderCellParams } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import * as React from 'react';

const options = {
  hidable: false,
  filterable: false,
  sortable: true,
  flex: 1,
};

const getProvideStatus = (status: 'PENDING' | 'ACCEPTED' | 'REJECTED') => {
  switch (status) {
    case 'PENDING':
      return (
        <Chip
          label="En attente"
          sx={{ color: (theme) => alpha(theme.palette.warning.main, 0.8) }}
          size="small"
          icon={<PendingIcon />}
        />
      );
    case 'ACCEPTED':
      return (
        <Chip
          label="Accepté"
          size="small"
          sx={{ color: (theme) => alpha(theme.palette.success.main, 0.8) }}
          icon={<CheckCircleIcon />}
        />
      );
    case 'REJECTED':
      return (
        <Chip
          label="Rejeté"
          sx={{ color: (theme) => alpha(theme.palette.error.main, 0.8) }}
          size="small"
          icon={<CancelIcon />}
        />
      );
    default:
      return null;
  }
};

const ProvidesReport = ({
  handlePageChange,
  pagination,
}: {
  handlePageChange(page: number): void;
  pagination: { pageSize: number; page: number };
}) => {
  const { currentUser } = useTypedSelector((state) => state.getCurrentUser);
  const { provides, meta, status, error } = useTypedSelector((state) => state.getProviders);
  const { isOpen } = useTypedSelector((state) => state.sidebar);

  const { pageSize, page } = pagination;

  const rows =
    provides &&
    provides?.map((el) => ({
      ...el.product,
      id: el.id,
      provider: el.provider,
      recipient: `${el.recipient.firstName} ${el.recipient.lastName}`,
      date: dayjs(el.createdAt).locale('fr').format('L LT'),
      quantity: el.quantity,
      description: el.description,
      status: el.status,
      userId: currentUser?.user.id,
      action: el,
    }));

  const columns = React.useMemo<GridColumns<MyProduct[]>>(
    () => [
      {
        ...options,
        field: 'avatar',
        headerName: 'Avatar',
        headerAlign: 'center',
        width: 80,
        flex: 0,
        resizable: true,
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
            <HistoryIcon sx={{ fontSize: 24 }} color="primary" />
          </Stack>
        ),
      },
      { ...options, flex: 1, minWidth: 210, field: 'date', headerName: 'Date', resizable: true },
      { ...options, flex: 1, minWidth: 180, field: 'name', headerName: 'Nom' },
      { ...options, flex: 1, minWidth: 180, field: 'description', headerName: 'Description' },
      { ...options, field: 'quantity', headerName: 'Quantité', flex: 0 },
      {
        ...options,
        field: 'sellingPrice',
        headerName: 'Prix de vente',
        flex: 0,
        renderCell: (params: GridRenderCellParams<any>) => currency.format(params.row.sellingPrice),
      },
      {
        ...options,
        flex: 1,
        minWidth: 180,
        field: 'status',
        headerName: 'État',
        renderCell: (params: GridRenderCellParams<any>) => getProvideStatus(params.row.status),
      },
      {
        ...options,
        field: 'category',
        headerName: 'Catégorie',
        flex: 1,
        minWidth: 180,
        renderCell: (params: GridRenderCellParams<any>) => params.row.category.name,
      },
      {
        ...options,
        flex: 1,
        minWidth: 180,
        field: 'provider',
        headerName: 'Fournisseur',
        renderCell: (params: GridRenderCellParams<any>) =>
          `${params.row.provider.firstName} ${params.row.provider.lastName}`,
      },
      { ...options, flex: 1, minWidth: 180, field: 'recipient', headerName: 'Bénéficiaire' },
    ],
    [isOpen]
  );

  if (error) return <Error error={error} />;
  if (status === 'success' && !provides?.length) return <Empty />;

  return (
    <Stack sx={{ height: '70vh', my: 3, bgcolor: 'background.paper', p: 0.8 }}>
      <DataTable
        rowCount={meta?.count}
        page={page}
        rows={rows}
        handlePageChange={handlePageChange}
        pageSize={pageSize}
        columns={columns}
        loading={status !== 'success' ? true : false}
      />
    </Stack>
  );
};

export default ProvidesReport;
