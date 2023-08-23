/* eslint-disable react-hooks/exhaustive-deps */
import ConfigCard from '@/components/ConfigCard';
import ConfigSkeletons from '@/components/ConfigSkeletons';
import Empty from '@/components/Empty';
import Error from '@/components/Error';
import Input from '@/components/Input';
import Modal from '@/components/Modal';
import SelectInput from '@/components/SelectInput';
import { cleanupUsers, getUsers, pushToUsersList, updateUsersList } from '@/features/users/getUsers';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { patchRequest, postRequest } from '@/lib/api';
import { AppDispatch } from '@/redux/store';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
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

const Users = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, status, error } = useTypedSelector((state) => state.getUsers);
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [role, setRole] = React.useState('');
  const [activate, setActivate] = React.useState<AccountStatus>('ACTIVE');
  const [editId, setEditId] = React.useState('');
  const [pagination, setPagination] = React.useState({
    page: 0,
    pageSize: 6,
  });

  const handleOpenModal = (data: User | null) => {
    if (data) {
      setFirstName(data.firstName);
      setLastName(data.lastName);
      setEmail(data.email);
      setRole(data.role);
      setActivate(data.status);
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
    setFirstName('');
    setEmail('');
    setLastName('');
    setRole('');
    setEditId('');
    setPassword('');
    setActivate('ACTIVE');
  };

  function handleConcatenateDate(newData: any) {
    dispatch(pushToUsersList(newData));
  }

  function handleUpdateDate(updatedDate: Category) {
    dispatch(updateUsersList(updatedDate));
  }

  const nextPage = () => {
    if (pagination.page >= Math.ceil(users.length / pagination.pageSize) - 1) return;
    setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
  };

  const prevPage = () => {
    if (pagination.page <= 0) return;
    setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
  };

  const updateData = async () => {
    const response = await patchRequest({
      endpoint: `/users/${editId}/update`,
      data: { firstName, lastName, role, email, ...(password && { password }), status: activate },
    });
    if (response?.error) {
      return toast.error(response.error);
    }
    toast.success('Utilisateur modifié avec succès');
    handleUpdateDate(response.data);
  };

  const addData = async () => {
    const response = await postRequest({
      endpoint: '/users/register',
      data: { firstName, lastName, role, email, status: activate },
    });
    if (response?.error) {
      if (typeof response.error?.message === 'string') {
        return toast.error(response.error?.message);
      }
      return response.error?.message?.map((el: string) => toast.error(el));
    }
    toast.success('Utilisateur créé avec succès');
    handleConcatenateDate(response.data);
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
    const fetchUsers = async () => {
      await dispatch(getUsers()).unwrap();
    };
    fetchUsers();
    return () => {
      dispatch(cleanupUsers());
    };
  }, []);

  const UsersList = () => {
    if (status !== 'success') return <ConfigSkeletons rows={2} columns={3} />;
    if (!users.length) return <Empty />;

    return (
      <Grid container spacing={2}>
        {users &&
          users
            .slice(pagination.page * pagination.pageSize, pagination.page * pagination.pageSize + pagination.pageSize)
            ?.map((el) => (
              <Grid item xs={12} sm={6} md={4} key={el.id}>
                <ConfigCard
                  title={`${el.firstName} ${el.lastName} ${el.status === 'ACTIVE' ? '' : '(Désactivé)'}`}
                  description={
                    el.role === 'SELLER' ? 'Vendeur' : el?.role === 'ADMIN' ? 'Administrateur' : 'Super Admin'
                  }
                  onEdit={() => handleOpenModal(el)}
                >
                  <AccountCircleIcon sx={{ fontSize: 52 }} color="primary" />
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
        <Typography variant="h6">Utilisateurs</Typography>
        <Button variant="contained" disableElevation onClick={handleAddNew}>
          Ajouter
        </Button>
      </Stack>

      <Modal title={editId ? "Modifier l'utilisateur" : 'Ajouter un utilisateur'} size="sm" onSubmit={onSubmit}>
        <Stack spacing={2}>
          <Input
            label="Email"
            value={email}
            placeholder="Entrer votre l'adresse mail"
            handleChange={(e: Event) => setEmail(e.target.value)}
            name="email"
          />
          <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} justifyContent="center" alignItems="center">
            <Input
              label="Nom"
              value={firstName}
              placeholder="Entrer votre la nom"
              handleChange={(e: Event) => setFirstName(e.target.value)}
              name="firstName"
            />
            <Input
              label="Postnom"
              value={lastName}
              placeholder="Entrer votre la postnom"
              handleChange={(e: Event) => setLastName(e.target.value)}
              name="lastName"
            />
          </Stack>
          {role !== 'SUPER_ADMIN' && (
            <>
              {' '}
              <SelectInput
                name="role"
                placeholder="Sélectionner le rôle"
                value={role}
                label="Rôle"
                data={[
                  { id: 'ADMIN', label: 'Administrateur', value: 'ADMIN' },
                  { id: 'SELLER', label: 'Vendeur', value: 'SELLER' },
                ]}
                handleChange={(e: Event) => setRole(e.target.value)}
              />
              <SelectInput
                name="activate"
                placeholder="Sélectionner l’état"
                value={activate}
                label="État"
                data={[
                  { id: 'DISABLED', label: 'Désactivé', value: 'DISABLED' },
                  { id: 'ACTIVE', label: 'Activé', value: 'ACTIVE' },
                ]}
                handleChange={(e: Event) => setActivate(e.target.value as any)}
              />
              {editId && (
                <Input
                  label="Nouveau mot de passe"
                  value={password}
                  placeholder="Entrer un nouveau mot de passe"
                  handleChange={(e: Event) => setPassword(e.target.value)}
                  name="password"
                  type="password"
                  isPassword
                  disableAutoComplete
                />
              )}
            </>
          )}
        </Stack>
      </Modal>
      <Stack sx={{ minHeight: '60vh', my: 2 }}>
        <UsersList />
      </Stack>

      <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ pb: 2 }}>
        <IconButton onClick={prevPage}>
          <KeyboardDoubleArrowLeftIcon color="primary" />
        </IconButton>
        <Paper variant="outlined" sx={{ px: 2, py: 1 }}>
          <Typography>
            Page {pagination.page + 1} / {Math.ceil(users.length / pagination.pageSize)}
          </Typography>
        </Paper>
        <IconButton onClick={nextPage}>
          <KeyboardDoubleArrowRightIcon color="primary" />
        </IconButton>
      </Stack>
    </>
  );
};

export default Users;
