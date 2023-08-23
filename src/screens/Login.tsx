import BG from '@/assets/phone.png';
import Input from '@/components/Input';
import ToastNotification from '@/components/ToastNotification';
import KeyIcon from '@mui/icons-material/Key';
import MailIcon from '@mui/icons-material/Mail';
import LoadingButton from '@mui/lab/LoadingButton';
import { styled } from '@mui/material';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import { toast } from 'react-toastify';

const Background = styled(Image)({
  opacity: 0.6,
});

const Login = () => {
  const router = useRouter();

  const [state, setState] = React.useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = React.useState(false);

  const { email, password } = state;

  const handleChange = (event: { target: { value: string; name: string } }) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const onLogin = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        '/api/login',
        { email, password },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );
      toast.success('Login successful!');
      router.push('/');
      setState({ email: '', password: '' });
      return { data: res.data };
    } catch (e: any) {
      setLoading(false);
      toast.error(e.response?.data?.message);
      return { error: e.response?.data?.message };
    }
  };

  return (
    <Stack>
      <ToastNotification />
      <Grid container spacing={4}>
        <Grid item xs={12} md={7} sx={{ bgcolor: 'primary.main', position: 'relative' }}>
          <Background src={BG} layout="fill" objectFit="cover" />
        </Grid>
        <Grid item xs={12} md={5}>
          <Container>
            <Stack spacing={3} justifyContent="center" sx={{ minHeight: { xs: 'auto', md: '100vh' }, py: 4, px: 4 }}>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Welcome to La Merva Shop
              </Typography>
              <Typography gutterBottom>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem tempore incidunt sed recusandae odit
                sit.
              </Typography>
              <Input
                label="Email"
                icon={<MailIcon />}
                placeholder="Entrer votre adresse mail"
                handleChange={handleChange}
                name="email"
                type="email"
              />
              <Input
                label="Mot de passe"
                icon={<KeyIcon />}
                placeholder="Entrer votre mot de passe"
                handleChange={handleChange}
                name="password"
                type="password"
                isPassword
              />
              <LoadingButton size="small" onClick={onLogin} loading={loading} variant="contained" sx={{ py: 1 }}>
                Login
              </LoadingButton>
            </Stack>
          </Container>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default Login;
