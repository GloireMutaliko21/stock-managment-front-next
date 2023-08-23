import DataTable from '@/components/DataTable';
import Empty from '@/components/Empty';
import Error from '@/components/Error';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { AppDispatch } from '@/redux/store';
import InventoryIcon from '@mui/icons-material/Inventory';
import { alpha, Stack } from '@mui/material';
import { GridColumns, GridRenderCellParams } from '@mui/x-data-grid';
import 'dayjs/locale/fr';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { currency } from '../../lib/currency';

const options = {
  hidable: false,
  filterable: false,
  sortable: true,
  flex: 0,
};

const InventoryList = ({ handlePageChange }: { handlePageChange(page: number): void }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentUser } = useTypedSelector((state) => state.getCurrentUser);
  const { inventory, meta, status, error } = useTypedSelector((state) => state.getInventory);
  const { isOpen } = useTypedSelector((state) => state.sidebar);
  const [pagination, setPagination] = React.useState({
    page: 0,
    pageSize: 100,
  });

  const { pageSize, page } = pagination;

  const rows = inventory && inventory?.map((el) => el);

  const columns = React.useMemo<GridColumns<MyProduct[]>>(
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
            <InventoryIcon sx={{ fontSize: 24 }} color="primary" />
          </Stack>
        ),
      },
      {
        ...options,
        minWidth: 180,
        field: 'name',
        headerName: 'Nom du vendeur',
        renderCell: (params: GridRenderCellParams<any>) => `${params.row.firstName} ${params.row.lastName}`,
      },
      { ...options, minWidth: 180, field: 'provides', headerName: 'Produits reçus' },
      { ...options, minWidth: 180, field: 'sales', headerName: 'Produits vendus' },
      {
        ...options,
        minWidth: 180,
        field: 'beneficiary',
        headerName: 'Bénéfice',
        renderCell: (params: GridRenderCellParams<any>) => currency.format(params.row.beneficiary),
      },
      { ...options, minWidth: 180, field: 'stock', headerName: 'Produits en stock' },
      {
        ...options,
        minWidth: 180,
        field: 'totalAmount',
        headerName: 'Montant généré',
        renderCell: (params: GridRenderCellParams<any>) => currency.format(params.row.totalAmount),
      },
      {
        ...options,
        minWidth: 180,
        field: 'amountDue',
        headerName: 'Dette',
        renderCell: (params: GridRenderCellParams<any>) => currency.format(params.row.amountDue),
      },
      {
        ...options,
        minWidth: 180,
        field: 'amountPaid',
        headerName: 'Montant payé',
        renderCell: (params: GridRenderCellParams<any>) => currency.format(params.row.amountPaid),
      },
    ],
    [isOpen]
  );

  if (error) return <Error error={error} />;
  if (status === 'success' && !inventory?.length) return <Empty />;

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

export default InventoryList;
