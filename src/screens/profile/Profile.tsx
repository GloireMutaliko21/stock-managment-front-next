import Input from '@/components/Input';
import { setCurrentUser } from '@/features/currentUser/currentUser';
import { getUser, updateUser } from '@/features/user/getUser';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { patchRequest } from '@/lib/api';
import { AppDispatch } from '@/redux/store';
import { LoadingButton } from '@mui/lab';
import { Stack } from '@mui/material';
import React from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

type Event = { target: { value: string; name: string } };

const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentUser } = useTypedSelector((state) => state.getCurrentUser);
  const { user } = useTypedSelector((state) => state.getUser);
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const update = { firstName, lastName, email };

  const onSubmit = async () => {
    setLoading(true);
    const response = await patchRequest({
      endpoint: `/users/${currentUser?.user.id}/update`,
      data: { firstName, lastName, email, password },
    });
    if (response?.error) {
      setLoading(false);
      return toast.error(response.error);
    }
    setLoading(false);
    dispatch(updateUser({ ...update }));
    toast.success('Profile modifié avec succès');
  };

  React.useEffect(() => {
    if (currentUser?.user) {
      const fetchUserProfile = async () => {
        await dispatch(getUser(currentUser?.user.id)).unwrap();
      };
      fetchUserProfile();
    }
  }, [currentUser?.user.id]);

  React.useEffect(() => {
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setEmail(user.email);
  }, [user.id]);

  return (
    <Stack spacing={2}>
      <Input
        label="Email"
        value={email}
        placeholder="Entrer votre l'adresse mail"
        handleChange={(e: Event) => setEmail(e.target.value)}
        name="email"
      />
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
      <Input
        label="Mot de passe"
        value={password}
        placeholder="Entrer le nouveau mot de passe"
        handleChange={(e: Event) => setPassword(e.target.value)}
        name="password"
        type="password"
      />
      <LoadingButton disableElevation onClick={onSubmit} loading={loading} variant="contained" sx={{ py: 1, px: 3 }}>
        Enregistrer
      </LoadingButton>
    </Stack>
  );
};

export default Profile;
