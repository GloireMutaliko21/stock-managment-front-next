import Input from '@/components/Input';
import SearchIcon from '@mui/icons-material/Search';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { useTypedSelector } from '../../hooks/useTypedSelector';

dayjs.extend(utc);

/* eslint-disable react-hooks/exhaustive-deps */
import ConfigCardSupplier from '@/components/ConfigCardSupplier';
import ConfigSkeletons from '@/components/ConfigSkeletons';
import Empty from '@/components/Empty';
import Error from '@/components/Error';
import Modal from '@/components/Modal';
import {
  cleanupSuppliers,
  getSuppliers,
  pushToAllSuppliersList,
  updateAllSuppliers,
} from '@/features/suppliers/getSuppliers';
import { patchRequest, postRequest } from '@/lib/api';
import { AppDispatch } from '@/redux/store';
import FaceIcOn from '@mui/icons-material/Face';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { Button, Grid, Stack, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import { onCloseModal, onLoading, onOpenModal } from 'features/modal';
import React from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

type Event = { target: { value: string; name: string } };

const Suppliers = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { suppliers, status, error } = useTypedSelector((state) => state.getSupplier);
  const [name, setName] = React.useState('');
  const [tel, setTel] = React.useState('');
  const [editId, setEditId] = React.useState('');
  const [pagination, setPagination] = React.useState({
    page: 0,
    pageSize: 6,
  });
  const [search, setSearch] = React.useState('');

  const handleOpenModal = (data: Supplie | null) => {
    if (data) {
      setName(data.name);
      setTel(data.tel);
      setEditId(data.id);
    } else {
      handleResetData();
    }
    dispatch(onOpenModal());
  };

  const handleAddNew = () => {
    handleResetData();
    handleOpenModal(null);
  };

  const handleResetData = () => {
    setName('');
    setTel('');
    setEditId('');
  };

  function handleConcatenateDate(newData: any) {
    dispatch(pushToAllSuppliersList(newData));
  }

  function handleUpdateDate(updatedDate: Category) {
    dispatch(updateAllSuppliers(updatedDate));
  }

  const updateData = async () => {
    const response = await patchRequest({
      endpoint: `/suppliers/${editId}`,
      data: { name, tel },
    });
    if (response?.error) {
      return toast.error(response.error);
    }
    toast.success('Fournisseur modifiée avec succès');
    handleUpdateDate(response.data);
  };

  const addData = async () => {
    const response = await postRequest({
      endpoint: '/suppliers',
      data: { name, tel },
    });
    if (response?.error) {
      return response.error?.message?.map((el: string) => toast.error(el));
    }
    toast.success('Fournisseur créée avec succès');
    handleConcatenateDate(response.data);
  };

  const nextPage = () => {
    if (pagination.page >= Math.ceil(suppliers.length / pagination.pageSize) - 1) return;
    setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
  };

  const prevPage = () => {
    if (pagination.page <= 0) return;
    setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
  };

  const handleSearch = (e: Event) => {
    setSearch(e.target.value);
  };

  const onSubmit = async () => {
    try {
      dispatch(onLoading(true));
      editId ? await updateData() : await addData();
      handleResetData();
      dispatch(onCloseModal());
      dispatch(onLoading(false));
    } catch (e: any) {
      dispatch(onLoading(false));
      toast.error(e.response.data.message);
    }
  };

  React.useEffect(() => {
    const fetchSuppliers = async () => {
      await dispatch(getSuppliers(search)).unwrap();
    };
    fetchSuppliers();
    return () => {
      dispatch(cleanupSuppliers());
    };
  }, [search]);

  const CategoriesList = () => {
    if (status !== 'success') return <ConfigSkeletons rows={2} columns={3} />;
    if (!suppliers.length) return <Empty />;

    return (
      <Grid container spacing={2}>
        {suppliers &&
          suppliers
            ?.slice(pagination.page * pagination.pageSize, pagination.page * pagination.pageSize + pagination.pageSize)
            ?.map((el) => (
              <Grid item xs={12} sm={6} md={4} key={el.id}>
                <ConfigCardSupplier
                  title={el?.name}
                  description={el?.tel}
                  onEdit={() => handleOpenModal(el)}
                  isMenu={true}
                >
                  <FaceIcOn sx={{ fontSize: 36 }} color="primary" />
                </ConfigCardSupplier>
              </Grid>
            ))}
      </Grid>
    );
  };

  if (error) return <Error error={error} />;

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Fournisseurs</Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Input
            value={search}
            icon={<SearchIcon />}
            placeholder="Rechercher..."
            type="search"
            handleChange={handleSearch}
            name="search"
          />
          <Button variant="contained" sx={{ px: 3, py: 1.5, mt: 1 }} disableElevation onClick={handleAddNew}>
            Ajouter
          </Button>
        </Stack>
      </Stack>

      <Modal title={editId ? 'Modifier les informations' : 'Ajouter un fournisseur'} size="sm" onSubmit={onSubmit}>
        <Stack spacing={2}>
          <Input
            label="Nom du fournisseur"
            value={name}
            placeholder="John DOE"
            handleChange={(e: Event) => setName(e.target.value)}
            name="name"
          />
          <Input
            label="Numero de telephone"
            value={tel}
            placeholder="243934500000"
            handleChange={(e: Event) => setTel(e.target.value)}
            name="tel"
          />
        </Stack>
      </Modal>
      <Stack sx={{ minHeight: '60vh', my: 2 }}>
        <CategoriesList />
      </Stack>
      <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ pb: 2 }}>
        <IconButton onClick={prevPage}>
          <KeyboardDoubleArrowLeftIcon color="primary" />
        </IconButton>
        <Paper variant="outlined" sx={{ px: 2, py: 1 }}>
          <Typography>
            Page {pagination.page + 1} / {Math.ceil(suppliers.length / pagination.pageSize)}
          </Typography>
        </Paper>
        <IconButton onClick={nextPage}>
          <KeyboardDoubleArrowRightIcon color="primary" />
        </IconButton>
      </Stack>
    </>
  );
};

export default Suppliers;
