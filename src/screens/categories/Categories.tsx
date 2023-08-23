/* eslint-disable react-hooks/exhaustive-deps */
import ConfigCard from '@/components/ConfigCard';
import ConfigSkeletons from '@/components/ConfigSkeletons';
import Empty from '@/components/Empty';
import Error from '@/components/Error';
import Input from '@/components/Input';
import Modal from '@/components/Modal';
import {
  cleanupCategories,
  getCategories,
  pushToCategoriesList,
  updateCategoriesList,
} from '@/features/categories/getCategories';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { patchRequest, postRequest } from '@/lib/api';
import { AppDispatch } from '@/redux/store';
import CategoryIcon from '@mui/icons-material/Category';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import SearchIcon from '@mui/icons-material/Search';
import { Button, Grid, Stack, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import { onCloseModal, onLoading, onOpenModal } from 'features/modal';
import React from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

type Event = { target: { value: string; name: string } };

const Categories = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, status, error } = useTypedSelector((state) => state.getCategories);
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [editId, setEditId] = React.useState('');
  const [cat, setCat] = React.useState(categories);
  const [pagination, setPagination] = React.useState({
    page: 0,
    pageSize: 6,
  });
  const [search, setSearch] = React.useState('');

  const handleOpenModal = (data: Category | null) => {
    if (data) {
      setName(data.name);
      setDescription(data.description);
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
    setDescription('');
    setEditId('');
  };

  function handleConcatenateDate(newData: any) {
    dispatch(pushToCategoriesList(newData));
  }

  function handleUpdateDate(updatedDate: Category) {
    dispatch(updateCategoriesList(updatedDate));
  }

  const updateData = async () => {
    const response = await patchRequest({
      endpoint: `/categories/${editId}`,
      data: { name, description },
    });
    if (response?.error) {
      return toast.error(response.error);
    }
    toast.success('Catégorie modifiée avec succès');
    handleUpdateDate(response.data);
  };

  const addData = async () => {
    const response = await postRequest({
      endpoint: '/categories',
      data: { name, description },
    });
    if (response?.error) {
      return response.error?.message?.map((el: string) => toast.error(el));
    }
    toast.success('Catégorie créée avec succès');
    handleConcatenateDate(response.data);
  };

  const nextPage = () => {
    if (pagination.page >= Math.ceil(categories.length / pagination.pageSize) - 1) return;
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
    dispatch(onLoading(true));
    editId ? await updateData() : await addData();
    handleResetData();
    dispatch(onCloseModal());
    dispatch(onLoading(false));
    try {
    } catch (e: any) {
      dispatch(onLoading(false));
      toast.error(e.response.data.message);
    }
  };

  React.useEffect(() => {
    const fetchCategories = async () => {
      await dispatch(getCategories(search)).unwrap();
    };
    fetchCategories();
    return () => {
      dispatch(cleanupCategories());
    };
  }, [search]);

  const CategoriesList = () => {
    if (status !== 'success') return <ConfigSkeletons rows={2} columns={3} />;
    if (!categories.length) return <Empty />;

    return (
      <Grid container spacing={2}>
        {categories &&
          categories
            ?.slice(pagination.page * pagination.pageSize, pagination.page * pagination.pageSize + pagination.pageSize)
            ?.map((el) => (
              <Grid item xs={12} sm={6} md={4} key={el.id}>
                <ConfigCard title={el.name} description={el.description} onEdit={() => handleOpenModal(el)}>
                  <CategoryIcon sx={{ fontSize: 36 }} color="primary" />
                </ConfigCard>
              </Grid>
            ))}
      </Grid>
    );
  };

  if (error) return <Error error={error} />;

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Catégories</Typography>
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

      <Modal title={editId ? 'Modifier la catégorie' : 'Ajouter une catégorie'} size="sm" onSubmit={onSubmit}>
        <Stack spacing={2}>
          <Input
            label="Nom"
            value={name}
            placeholder="Entrer le nom"
            handleChange={(e: Event) => setName(e.target.value)}
            name="name"
          />
          <Input
            label="Description"
            value={description}
            placeholder="Entrer la description de la catégorie"
            handleChange={(e: Event) => setDescription(e.target.value)}
            name="description"
            type="textarea"
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
            Page {pagination.page + 1} / {Math.ceil(categories.length / pagination.pageSize)}
          </Typography>
        </Paper>
        <IconButton onClick={nextPage}>
          <KeyboardDoubleArrowRightIcon color="primary" />
        </IconButton>
      </Stack>
    </>
  );
};

export default Categories;
