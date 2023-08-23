import Input from '@/components/Input';
import SelectInput from '@/components/SelectInput';
import { cleanupProviders, getProviders } from '@/features/products/getProviders';
import { AppDispatch } from '@/redux/store';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SearchIcon from '@mui/icons-material/Search';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import InputBase from '@mui/material/InputBase';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useRouter } from 'next/router';
import qs from 'qs';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { cleanupCategories, getCategories } from '../../features/categories/getCategories';
import { cleanupUsers, getUsers } from '../../features/users/getUsers';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { getRequest } from '../../lib/api';
import { generatePdfProvide } from '../../utils/generatePdfProvide';
import ProvidesReport from './ProvidesReports';
dayjs.extend(utc);

type Event = { target: { value: string; name: string } };

const Provides = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { locale } = useRouter();
  const { users } = useTypedSelector((state) => state.getUsers);
  const { categories, status, error } = useTypedSelector((state) => state.getCategories);
  const [startDate, setStartDate] = React.useState<Dayjs | null>(null);
  const [endDate, setEndDate] = React.useState<Dayjs | null>(null);
  const [filterByStatus, setFilterByStatus] = React.useState('');
  const [category, setCategory] = React.useState('');
  const { currentUser } = useTypedSelector((state) => state.getCurrentUser);
  const [selectedUser, setSelectedUser] = React.useState('');
  const [pagination, setPagination] = React.useState({
    page: 0,
    pageSize: 25,
  });

  const [loading, setLoading] = React.useState(false);

  const [search, setSearch] = React.useState('');
  const { pageSize, page } = pagination;

  const query = qs.stringify({
    _q: {
      skip: pageSize,
      page,
      search,
      status: filterByStatus,
      category,
      startDate: startDate?.utcOffset(0).endOf('day').format(),
      endDate: endDate?.utcOffset(0)?.endOf('day')?.format(),
      recipient: currentUser?.user?.role === 'SELLER' ? currentUser?.user?.id : selectedUser,
    },
  });

  async function handlePageChange(page: number) {
    setPagination({ ...pagination, page });
  }

  const handleChangeUser = (event: Event) => {
    setSelectedUser(event.target.value);
    setPagination({ ...pagination, page: 0 });
  };

  const handleGeneratePdf = async () => {
    setLoading(true);
    const response = await getRequest({
      endpoint: `/providers?${qs.stringify({
        _q: {
          page,
          search,
          status: filterByStatus,
          category,
          startDate: startDate?.toISOString(),
          endDate: endDate?.toISOString(),
          recipient: currentUser?.user?.role === 'SELLER' ? currentUser?.user?.id : selectedUser,
        },
      })}`,
    });

    if (!response.data) {
      setLoading(false);
      return toast.error("Error d'exportation");
    }

    if (response.data?.provides?.length === 0) {
      setLoading(false);
      return toast.error('Aucune vente à exporter');
    }

    if (response.data?.data?.provides?.length > 0) {
      await generatePdfProvide(
        response.data?.data?.provides,
        users.find((el) => el.id === selectedUser)
      );
      setLoading(false);
      toast.success('Exportation réussie');
    }
  };

  React.useEffect(() => {
    const fetchProducts = async () => {
      await dispatch(getProviders(query)).unwrap();
      await dispatch(getUsers()).unwrap();
      await dispatch(getCategories('')).unwrap();
    };
    fetchProducts();
    return () => {
      dispatch(cleanupProviders());
      dispatch(cleanupUsers());
      dispatch(cleanupCategories());
    };
  }, [search, page, pageSize, filterByStatus, category, selectedUser, startDate, endDate]);

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
        <Grid item xs={12} md={12} lg={1.5}>
          <Button
            sx={{ height: 1, width: 1, py: 1.4, px: 3 }}
            variant="contained"
            startIcon={<PictureAsPdfIcon />}
            onClick={handleGeneratePdf}
          >
            {loading ? 'Exportation...' : 'Exporter'}
          </Button>
        </Grid>
        <Grid item xs={12} md={6} lg={3.5}>
          <Grid item container alignItems="center" justifyContent="space-between" sx={{ display: 'flex' }}>
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
        </Grid>
        <Grid item xs={12} md={6} lg={2}>
          <SelectInput
            name="userId"
            placeholder="Utilisateur"
            value={selectedUser}
            data={users
              .filter((el) => el.status === 'ACTIVE')
              .map((el) => ({ id: el.id, label: `${el.firstName} ${el.lastName}`, value: el.id }))}
            handleChange={handleChangeUser}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={1.75}>
          <SelectInput
            name="category"
            placeholder="Catégorie"
            value={category}
            data={
              categories &&
              categories.map((category) => ({ value: category.id, label: category.name, id: category.id }))
            }
            handleChange={(e: Event) => setCategory(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={1.5}>
          <SelectInput
            name="filterByStatus"
            placeholder="État"
            value={filterByStatus}
            data={[
              { value: 'PENDING', label: 'En attente', id: 'pending' },
              { value: 'ACCEPTED', label: 'Accepté', id: 'accepted' },
              { value: 'REJECTED', label: 'Rejeté', id: 'rejected' },
            ]}
            handleChange={(e: Event) => setFilterByStatus(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={1.74}>
          <Input
            value={search}
            icon={<SearchIcon />}
            placeholder="Rechercher..."
            type="search"
            handleChange={(e: Event) => setSearch(e.target.value)}
            name="search"
          />
        </Grid>
      </Grid>

      <ProvidesReport handlePageChange={handlePageChange} pagination={pagination} />
    </>
  );
};

export default Provides;
