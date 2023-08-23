/* eslint-disable react-hooks/exhaustive-deps */
import DataTable from '@/components/DataTable';
import Empty from '@/components/Empty';
import Error from '@/components/Error';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { AppDispatch } from '@/redux/store';
import GroupIcon from '@mui/icons-material/Group';
import { alpha, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import { GridColumns, GridRenderCellParams } from '@mui/x-data-grid';
import qs from 'qs';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { currency } from '../../lib/currency';

const options = {
  hidable: false,
  filterable: false,
  sortable: true,
  flex: 1,
};

type Event = { target: { value: string; name: string } };

const ProductsList = ({
  handlePageChange,
  pagination,
}: {
  handlePageChange(page: number): void;
  pagination: { pageSize: number; page: number };
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentUser } = useTypedSelector((state) => state.getCurrentUser);
  const { products, meta, status, error } = useTypedSelector((state) => state.getMyProducts);
  const { isOpen } = useTypedSelector((state) => state.sidebar);

  const [showModal, setShowModal] = React.useState({
    addToCart: false,
    provide: false,
  });

  const [search, setSearch] = React.useState('');
  const { pageSize, page } = pagination;

  const query = qs.stringify({
    _q: { skip: pageSize, page, search },
  });

  const handleChange = (event: Event) => {
    setSearch(event.target.value);
  };

  // async function handlePageChange(page: number) {
  //   setPagination({ ...pagination, page });
  // }

  const rows = products && products?.map((el) => ({ ...el.product, stock: el.stock, action: el.product }));

  const columns = React.useMemo<GridColumns<MyProduct[]>>(
    () => [
      {
        ...options,
        field: 'avatar',
        headerName: 'Avatar',
        headerAlign: 'center',
        width: 80,
        flex: 0,
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
            <GroupIcon sx={{ fontSize: 24 }} color="primary" />
          </Stack>
        ),
      },
      { ...options, minWidth: 180, field: 'name', headerName: 'Nom' },
      {
        ...options,
        field: 'category',
        minWidth: 180,
        headerName: 'Catégorie',
        renderCell: (params: GridRenderCellParams<any>) => params.row.category.name,
      },
      // { ...options, field: 'sellingPrice', headerName: 'Prix de vente', flex: 0 },
      // { ...options, flex: 1, minWidth: 180, field: 'description', headerName: 'Description' },
      {
        ...options,
        field: 'stock',
        headerName: 'Stock',
        renderCell: (params: GridRenderCellParams<any>) => (
          <Typography color={params.row.stock === 0 ? 'error.main' : 'text.primary'}>{params.row.stock}</Typography>
        ),
      },
      {
        ...options,
        field: 'purchasedPrice',
        headerName: 'Bénéfice estimé',
        renderCell: (params: GridRenderCellParams<any>) =>
          currency.format(params.row.sellingPrice - params.row.purchasedPrice),
      },
    ],
    [isOpen]
  );

  if (error) return <Error error={error} />;
  if (status !== 'pending' && !products?.length) return <Empty />;

  return (
    <Stack sx={{ height: '70vh', my: 3, bgcolor: 'background.paper', p: 0.5 }}>
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

export default ProductsList;
