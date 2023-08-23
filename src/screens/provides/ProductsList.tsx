import DataTable from '@/components/DataTable';
import Empty from '@/components/Empty';
import Error from '@/components/Error';
import { sliceToNewProductsList } from '@/features/newProducts/getNewProducts';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { patchRequest } from '@/lib/api';
import { currency } from '@/lib/currency';
import { AppDispatch } from '@/redux/store';
import SearchIcon from '@mui/icons-material/Search';
import { alpha, Button, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import { GridColumns, GridRenderCellParams, GridRowParams } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import Modal from '@/components/Modal';
import { onCloseModal, onOpenModal } from '@/features/modal';

const options = {
  hidable: false,
  filterable: false,
  sortable: true,
  flex: 1,
};

const ProductsList = ({
  handlePageChange,
  pagination,
}: {
  handlePageChange(page: number): void;
  pagination: { pageSize: number; page: number };
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentUser } = useTypedSelector((state) => state.getCurrentUser);
  const { provides, meta, status, error } = useTypedSelector((state) => state.getNewProducts);
  const { isOpen } = useTypedSelector((state) => state.sidebar);
  const [provideId, setProvideId] = React.useState('');
  const [provideAction, setProvideAction] = React.useState<'accepter' | 'annuler' | undefined>();

  const { pageSize, page } = pagination;

  const handleAccept = async (id: string) => {
    const response = await patchRequest({ endpoint: `/providers/${id}/accept` });
    if (response?.error) {
      dispatch(onCloseModal());
      return toast.error(response.error);
    }
    dispatch(sliceToNewProductsList(id));
    dispatch(onCloseModal());
    toast.success('Approvisionnement acceptée avec succès');
  };

  const handleShowAccepter = (id: string) => {
    setProvideAction('accepter');
    setProvideId(id);
    dispatch(onOpenModal());
  };

  const handleShowAnnuler = (id: string) => {
    setProvideAction('annuler');
    setProvideId(id);
    dispatch(onOpenModal());
  };

  const handleReject = async (id: string) => {
    const response = await patchRequest({ endpoint: `/providers/${id}/reject` });
    if (response?.error) {
      dispatch(onCloseModal());
      return toast.error(response.error);
    }
    dispatch(sliceToNewProductsList(id));
    dispatch(onCloseModal());
    toast.success('Approvisionnement annulée avec succès');
  };

  const rows =
    provides &&
    provides?.map((el) => ({
      ...el.product,
      id: el.id,
      provider: el.provider,
      recipient: el.recipient,
      date: dayjs(el.createdAt).locale('fr').format('L LT'),
      quantity: el.quantity,
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
            <SearchIcon sx={{ fontSize: 24 }} color="primary" />
          </Stack>
        ),
      },
      { ...options, flex: 1, minWidth: 180, field: 'name', headerName: 'Nom' },
      { ...options, flex: 1, minWidth: 180, field: 'description', headerName: 'Description' },
      {
        ...options,
        field: 'category',
        headerName: 'Catégorie',
        flex: 1,
        minWidth: 180,
        renderCell: (params: GridRenderCellParams<any>) => params.row.category.name,
      },
      { ...options, flex: 1, minWidth: 180, field: 'date', headerName: 'Date' },
      {
        ...options,
        flex: 1,
        minWidth: 180,
        field: 'provider',
        headerName: 'Fournisseur',
        renderCell: (params: GridRenderCellParams<any>) =>
          `${params.row.provider.firstName} ${params.row.provider.lastName}`,
      },
      {
        ...options,
        flex: 1,
        minWidth: 180,
        field: 'recipient',
        headerName: 'Bénéficiaire',
        renderCell: (params: GridRenderCellParams<any>) =>
          `${params.row.recipient.firstName} ${params.row.recipient.lastName}`,
      },
      {
        ...options,
        field: 'sellingPrice',
        headerName: 'Prix de vente',
        flex: 0,
        renderCell: (params: GridRenderCellParams<any>) => currency.format(params.row.sellingPrice),
      },
      { ...options, field: 'quantity', headerName: 'Quantité', flex: 0 },
      {
        ...options,
        field: 'actions',
        headerName: 'Action',
        headerAlign: 'center',
        type: 'actions',
        align: 'center',
        width: 120,
        flex: 0,
        getActions: (params: GridRowParams<any>) => [
          currentUser?.user?.id === params.row.recipient.id ? (
            // @ts-ignore
            <Button onClick={() => handleShowAccepter(params.row.id)} variant="outlined" size="small">
              Accepter
            </Button>
          ) : (
            <Button onClick={() => handleShowAnnuler(params.row.id)} color="error" variant="outlined" size="small">
              Annuler
            </Button>
          ),
        ],
      },
    ],
    [isOpen]
  );

  if (error) return <Error error={error} />;
  if (status === 'success' && !provides?.length) return <Empty />;

  return (
    <Stack sx={{ height: '70vh', my: 3, bgcolor: 'background.paper', p: 0.5 }}>
      {provideAction === 'accepter' && (
        <Modal primaryActionLabel="Accepter" size="sm" onSubmit={() => handleAccept(provideId)}>
          <Typography variant="h6" align="center">
            {"Voulez-vous accepter l'approvisionnement?"}
          </Typography>
        </Modal>
      )}
      {provideAction === 'annuler' && (
        <Modal primaryActionLabel="Accepter" size="sm" onSubmit={() => handleReject(provideId)}>
          <Typography variant="h6" align="center">
            {"Voulez-vous annuler l'approvisionnement?"}
          </Typography>
        </Modal>
      )}
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
