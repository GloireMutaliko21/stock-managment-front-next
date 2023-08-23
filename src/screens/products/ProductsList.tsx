/* eslint-disable react-hooks/exhaustive-deps */
import DataTable from '@/components/DataTable';
import Empty from '@/components/Empty';
import Error from '@/components/Error';
import { sliceToProductsList } from '@/features/products/getProducts';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { patchRequest } from '@/lib/api';
import { currency } from '@/lib/currency';
import { AppDispatch } from '@/redux/store';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import PhonelinkSetupIcon from '@mui/icons-material/PhonelinkSetup';
import { alpha, Stack } from '@mui/material';
import { GridActionsCellItem, GridColumns, GridRenderCellParams, GridRowParams } from '@mui/x-data-grid';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const options = {
  hidable: false,
  filterable: false,
  sortable: true,
  flex: 1,
};

type Event = { target: { value: string; name: string } };

const ProductsList = ({
  handlePageChange,
  handleEditModal,
  handleSupplyModal,
  pagination,
}: {
  handlePageChange(page: number): void;
  handleEditModal(data: Product | null): void;
  handleSupplyModal(data: Product | null): void;
  pagination: { pageSize: number; page: number };
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, meta, status, error } = useTypedSelector((state) => state.getProducts);
  const { isOpen } = useTypedSelector((state) => state.sidebar);
  const { pageSize, page } = pagination;

  const deleteProduct = async (id: string) => {
    const response = await patchRequest({ endpoint: `/products/${id}/disable` });
    if (response?.error) {
      return toast.error(response.error);
    }
    dispatch(sliceToProductsList(id));
    toast.success('Produit supprimé avec succès');
  };

  const rows = products && products.map((product) => ({ ...product }));

  const columns = React.useMemo<GridColumns<any>>(
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
            <PhonelinkSetupIcon sx={{ fontSize: 24 }} color="primary" />
          </Stack>
        ),
      },
      { ...options, flex: 1, minWidth: 180, field: 'name', headerName: 'Nom' },
      {
        ...options,
        flex: 1,
        minWidth: 180,
        field: 'category',
        headerName: 'Catégorie',
        renderCell: (params: GridRenderCellParams<any>) => params.row.category.name,
      },
      {
        ...options,
        field: 'purchasedPrice',
        headerName: "Prix d'achat",
        flex: 0,
        renderCell: (params: GridRenderCellParams<any>) => currency.format(params.row.purchasedPrice),
      },
      {
        ...options,
        field: 'sellingPrice',
        headerName: 'Prix de vente',
        flex: 0,
        renderCell: (params: GridRenderCellParams<any>) => currency.format(params.row.sellingPrice),
      },
      { ...options, flex: 1, minWidth: 180, field: 'description', headerName: 'Description' },
      { ...options, field: 'stock', headerName: 'Quantité', flex: 0 },
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
            icon={<AddCircleIcon color="primary" />}
            label="Mise en stock"
            onClick={() => handleSupplyModal(params.row)}
          />,
          // @ts-ignore
          <GridActionsCellItem
            icon={<ModeEditIcon color="info" />}
            label="Modifier"
            key="Modifier"
            onClick={() => handleEditModal(params.row)}
            showInMenu
          />,
          // @ts-ignore
          <GridActionsCellItem
            icon={<DeleteIcon color="error" />}
            label="Supprimer"
            key="Supprimer"
            onClick={() => deleteProduct(params.row.id)}
            showInMenu
          />,
        ],
      },
    ],
    [isOpen, page]
  );

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
