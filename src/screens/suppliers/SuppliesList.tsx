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

const getSuppliesStatus = (status: 'PENDING' | 'ACCEPTED' | 'REJECTED') => {
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

const SuppliesList = ({
  handlePageChange,
  pagination,
}: {
  handlePageChange(page: number): void;
  pagination: { pageSize: number; page: number };
}) => {
  const { suppliers, meta, status, error } = useTypedSelector((state) => state.getSupplier);
  const { isOpen } = useTypedSelector((state) => state.sidebar);

  const { pageSize, page } = pagination;

  const rows = suppliers;

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
      { ...options, flex: 1, minWidth: 180, field: 'tel', headerName: 'Telephone' },
    ],
    [isOpen]
  );

  if (error) return <Error error={error} />;
  if (status === 'success' && !suppliers?.length) return <Empty />;

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

export default SuppliesList;
