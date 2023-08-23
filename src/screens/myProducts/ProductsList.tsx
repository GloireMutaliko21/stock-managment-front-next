/* eslint-disable react-hooks/exhaustive-deps */
import DataTable from '@/components/DataTable';
import Empty from '@/components/Empty';
import Error from '@/components/Error';
import { cleanupMyProducts, getMyProducts } from '@/features/myProducts/getMyProducts';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { AppDispatch } from '@/redux/store';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import AddToHomeScreenIcon from '@mui/icons-material/AddToHomeScreen';
import StorageIcon from '@mui/icons-material/Storage';
import { alpha, Stack } from '@mui/material';
import { GridActionsCellItem, GridColumns, GridRenderCellParams, GridRowParams } from '@mui/x-data-grid';
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
  handleShowProvideModal,
  handleShowAddToCartModal,
  pagination,
}: {
  handlePageChange(page: number): void;
  handleShowProvideModal(data: Product | null): void;
  handleShowAddToCartModal(data: Product | null): void;
  pagination: { pageSize: number; page: number };
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentUser } = useTypedSelector((state) => state.getCurrentUser);
  const { products, meta, status, error } = useTypedSelector((state) => state.getMyProducts);
  const { isOpen } = useTypedSelector((state) => state.sidebar);

  const [search, setSearch] = React.useState('');
  const { pageSize, page } = pagination;

  const query = qs.stringify({
    _q: { skip: pageSize, page, search },
  });

  const handleChange = (event: Event) => {
    setSearch(event.target.value);
  };

  const rows =
    products &&
    products.filter((el) => el.stock > 0)?.map((el) => ({ ...el.product, stock: el.stock, action: el.product }));

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
            <StorageIcon sx={{ fontSize: 24 }} color="primary" />
          </Stack>
        ),
      },
      { ...options, flex: 1, minWidth: 180, field: 'name', headerName: 'Nom' },
      { ...options, flex: 1, minWidth: 180, field: 'description', headerName: 'Description' },
      {
        ...options,
        field: 'category',
        flex: 1,
        minWidth: 180,
        headerName: 'Catégorie',
        renderCell: (params: GridRenderCellParams<any>) => params.row.category.name,
      },
      {
        ...options,
        field: 'sellingPrice',
        headerName: 'Prix de vente',
        flex: 0,
        minWidth: 180,
        renderCell: (params: GridRenderCellParams<any>) => currency.format(params.row.sellingPrice),
      },
      { ...options, field: 'stock', headerName: 'Quantité', flex: 0, minWidth: 180 },
      {
        ...options,
        field: 'actions',
        headerName: 'Action',
        headerAlign: 'center',
        type: 'actions',
        align: 'center',
        width: 120,
        flex: 0,
        getActions: (params: GridRowParams<Product>) => [
          // @ts-ignore
          <GridActionsCellItem
            key="voir"
            icon={<AddShoppingCartIcon color="primary" />}
            label="Ajout au panier"
            onClick={() => handleShowAddToCartModal(params.row)}
          />,
          // @ts-ignore
          <GridActionsCellItem
            icon={<AddToHomeScreenIcon color="warning" />}
            label="Approvisionner"
            key="Approvisionner"
            onClick={() => handleShowProvideModal(params.row)}
            showInMenu
          />,
        ],
      },
    ],
    [isOpen]
  );

  React.useEffect(() => {
    const fetchProducts = async () => {
      await dispatch(getMyProducts({ query, userId: currentUser?.user?.id })).unwrap();
    };
    fetchProducts();
    return () => {
      dispatch(cleanupMyProducts());
    };
  }, [page, search, isOpen, currentUser?.user?.id]);

  if (error) return <Error error={error} />;
  if (status === 'success' && !products?.length) return <Empty />;

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
