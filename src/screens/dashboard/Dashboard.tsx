import Welcome from '@/assets/welcome.svg';
import SelectInput from '@/components/SelectInput';
import { getUser } from '@/features/user/getUser';
import { cleanupDashboard, getDashboard } from '@/features/users/dashboard';
import { cleanupUsers, getUsers } from '@/features/users/getUsers';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { currency } from '@/lib/currency';
import { AppDispatch } from '@/redux/store';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import { Stack, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Image from 'next/image';
import { useRouter } from 'next/router';
import qs from 'qs';
import React from 'react';
import { useDispatch } from 'react-redux';
dayjs.extend(utc);

type Event = { target: { value: string; name: string } };

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useTypedSelector((state) => state.getCurrentUser.currentUser?.user);
  const { users } = useTypedSelector((state) => state.getUsers);
  const [selectedUser, setSelectedUser] = React.useState('');
  const { dashboard } = useTypedSelector((state) => state.getDashboard);
  const [startDate, setStartDate] = React.useState<Dayjs | null>(null);
  const [endDate, setEndDate] = React.useState<Dayjs | null>(null);
  const { locale } = useRouter();

  const currentUserId = user?.id;

  const query = qs.stringify({
    userId: selectedUser || currentUserId,
    startDate: startDate?.startOf('day')?.utc().format(),
    endDate: endDate?.endOf('day')?.utc().format(),
  });

  React.useEffect(() => {
    const fetchData = async () => {
      await dispatch(getDashboard(query)).unwrap();
    };
    fetchData();
  }, [startDate, endDate, selectedUser]);

  React.useEffect(() => {
    if (!currentUserId) return;
    const fetchData = async () => {
      await dispatch(getUsers()).unwrap();
      await dispatch(getUser(currentUserId)).unwrap();
      await dispatch(getDashboard(query)).unwrap();
    };
    fetchData();
    return () => {
      dispatch(cleanupUsers());
      dispatch(cleanupDashboard());
    };
  }, [currentUserId]);

  if (user?.role !== 'SUPER_ADMIN')
    return (
      <Paper
        variant="outlined"
        component={Stack}
        justifyContent="center"
        alignItems="center"
        sx={{ width: 1, height: '78vh', p: 3 }}
        spacing={3}
      >
        <Box sx={{ width: 1, height: 250, position: 'relative' }}>
          <Image src={Welcome} alt="404" layout="fill" objectFit="contain" />
        </Box>
        <Typography variant="h5" fontWeight={700} textAlign="center">
          Soyez le bienvenue {user?.firstName} {user?.lastName}
        </Typography>
      </Paper>
    );

  return (
    <Stack spacing={2} sx={{ py: 2 }}>
      <Paper
        component={Stack}
        spacing={2}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        sx={{ p: 2 }}
        variant="outlined"
      >
        <Typography fontWeight={700} variant="h5">
          Tableau de board
        </Typography>
        <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} sx={{ width: { xs: 1, md: 'auto' } }}>
          <SelectInput
            name="user"
            placeholder="Filtrer par vendeur"
            value={selectedUser}
            data={users
              .filter((el) => el.status === 'ACTIVE')
              .map((el) => ({ id: el.id, label: `${el.firstName} ${el.lastName}`, value: el.id }))}
            handleChange={(e: Event) => setSelectedUser(e.target.value)}
          />
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item xs={12} md={5.5}>
              <DatePicker
                value={startDate}
                maxDate={dayjs(new Date())}
                desktopModeMediaQuery="(min-width: 768px)"
                onChange={(newValue) => {
                  setStartDate(dayjs(newValue));
                }}
                renderInput={({ inputRef, inputProps, InputProps }) => (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      width: 1,
                      border: 1,
                      py: 1,
                      px: 2,
                      borderRadius: 1,
                      borderColor: 'action.disabled',
                      '&:hover': {
                        borderColor: 'action.active',
                      },
                    }}
                  >
                    <InputBase placeholder="Début" ref={inputRef} {...(inputProps as any)} sx={{ width: 1 }} />
                    {InputProps?.endAdornment}
                  </Box>
                )}
              />
            </Grid>
            <Grid item md={1} justifyContent="center" sx={{ width: 1 }}>
              <Typography textAlign="center" sx={{ width: 1, mt: 1, mx: 'auto' }}>
                Au
              </Typography>
            </Grid>
            <Grid item xs={12} md={5.5}>
              <DatePicker
                label={locale === 'en' ? 'To' : 'Au'}
                value={endDate}
                minDate={startDate}
                maxDate={dayjs(new Date())}
                onChange={(newValue) => {
                  setEndDate(dayjs(newValue));
                }}
                renderInput={({ inputRef, inputProps, InputProps }) => (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      width: 1,
                      border: 1,
                      py: 1,
                      px: 2,
                      borderRadius: 1,
                      borderColor: 'action.disabled',
                      '&:hover': {
                        borderColor: 'action.active',
                      },
                    }}
                  >
                    <InputBase placeholder="Fin" ref={inputRef} {...(inputProps as any)} sx={{ width: 1 }} />
                    {InputProps?.endAdornment}
                  </Box>
                )}
              />
            </Grid>
          </Grid>
        </Stack>
      </Paper>
      <Box sx={{ py: 2 }}>
        <Grid container spacing={2}>
          {currentUserId &&
            dashboard &&
            Object.entries(dashboard).map((el) => (
              <Grid item xs={12} md={6} lg={4} key={el[0]}>
                <Paper
                  component={Stack}
                  justifyContent="space-between"
                  direction={{ xs: 'column', md: 'row' }}
                  alignItems="center"
                  spacing={2}
                  sx={{ p: 2 }}
                  variant="outlined"
                >
                  <InsertChartIcon color={getChartColor(el[0])} sx={{ fontSize: 64 }} />
                  <Stack alignItems={{ xs: 'center', md: 'flex-end' }}>
                    <Typography fontWeight={700} variant="h5">
                      {parseValue(el[0], el[1])}
                    </Typography>
                    <Typography color="text.secondary">{getChartLabel(el[0])}</Typography>
                  </Stack>
                </Paper>
              </Grid>
            ))}
        </Grid>
      </Box>
    </Stack>
  );
};

const getChartLabel = (label: string) => {
  switch (label) {
    case 'totalAmount':
      return 'Montant généré';
    case 'amountDue':
      return 'Dettes';
    case 'amountPaid':
      return 'Montant payé';
    case 'provides':
      return 'Produits reçus';
    case 'sales':
      return 'Produits vendus';
    case 'stock':
      return 'Produits en stock';
    case 'beneficiary':
      return 'Bénéfice net';
    case 'pa':
      return "Montant d'achat";
    case 'pv':
      return 'Montant de vente';
    case 'profit':
      return 'Bénéfice estimé';
    default:
      return label;
  }
};

const getChartColor = (label: string) => {
  switch (label) {
    case 'totalAmount':
      return 'warning';
    case 'amountDue':
      return 'secondary';
    case 'amountPaid':
      return 'success';
    case 'provides':
      return 'info';
    case 'sales':
      return 'primary';
    case 'stock':
      return 'error';
    case 'beneficiary':
      return 'success';
    case 'pa':
      return 'secondary';
    case 'pv':
      return 'primary';
    case 'profit':
      return 'success';
    default:
      return 'primary';
  }
};

const parseValue = (label: string, value: number) => {
  switch (label) {
    case 'totalAmount':
      return currency.format(value);
    case 'amountDue':
      return currency.format(value);
    case 'amountPaid':
      return currency.format(value);
    case 'beneficiary':
      return currency.format(value);
    case 'pa':
      return currency.format(value);
    case 'pv':
      return currency.format(value);
    case 'profit':
      return currency.format(value);
    default:
      return value;
  }
};

export default Dashboard;
