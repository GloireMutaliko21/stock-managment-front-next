import Input from '@/components/Input';
import { cleanupInventory, getInventory } from '@/features/users/inventory';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { AppDispatch } from '@/redux/store';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SearchIcon from '@mui/icons-material/Search';
import { Stack, Typography } from '@mui/material';
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
import { getRequest } from '../../lib/api';
import { generatePdfInventory } from '../../utils/generatePdfInventory';
import InventoryList from './InventoryList';
dayjs.extend(utc);

type Event = { target: { value: string; name: string } };

interface Cart {
  product: string;
  quantity: number;
  price: number;
}

const Inventory = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users } = useTypedSelector((state) => state.getUsers);
  const user = useTypedSelector((state) => state.getCurrentUser.currentUser?.user);
  const [cart, setCart] = React.useState<Cart[] | null>(null);
  const { locale } = useRouter();
  const [pagination, setPagination] = React.useState({ page: 0 });
  const [startDate, setStartDate] = React.useState<Dayjs | null>(null);
  const [endDate, setEndDate] = React.useState<Dayjs | null>(null);
  const [loading, setLoading] = React.useState(false);

  const [search, setSearch] = React.useState('');
  const { page } = pagination;

  const query = qs.stringify({
    search,
    page,
    startDate: startDate?.startOf('day')?.utc().format(),
    endDate: endDate?.endOf('day')?.utc().format(),
    userId: user?.id,
  });

  async function handlePageChange(page: number) {
    setPagination({ ...pagination, page });
  }

  const handleGeneratePdf = async () => {
    setLoading(true);
    const response = await getRequest({
      endpoint: `/users/get/inventory/all?${qs.stringify({
        userId: user?.id,
        search,
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
      })}`,
    });

    if (!response.data) {
      setLoading(false);
      return toast.error("Error d'exportation");
    }

    if (response.data?.inventory?.length === 0) {
      setLoading(false);
      return toast.error('Aucune vente à exporter');
    }

    if (response.data?.data?.inventory?.length > 0) {
      await generatePdfInventory(response.data?.data?.inventory, startDate, endDate);
      setLoading(false);
      toast.success('Exportation réussie');
    }
  };

  React.useEffect(() => {
    const fetchProducts = async () => {
      await dispatch(getInventory(query)).unwrap();
    };
    fetchProducts();
    return () => {
      dispatch(cleanupInventory());
    };
  }, [search, page, startDate, endDate]);

  return (
    <>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Inventaire</Typography>
        <Stack direction={{ xs: 'column-reverse', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'center' }}>
          <div>
            <Button
              sx={{ height: 1, width: 1, py: 1.4, px: 3 }}
              variant="contained"
              startIcon={<PictureAsPdfIcon />}
              onClick={handleGeneratePdf}
            >
              {loading ? 'Exportation...' : 'Exporter'}
            </Button>
          </div>
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
          <Input
            value={search}
            icon={<SearchIcon />}
            placeholder="Rechercher..."
            type="search"
            handleChange={(e: Event) => setSearch(e.target.value)}
            name="search"
          />
        </Stack>
      </Stack>

      <InventoryList handlePageChange={handlePageChange} />
    </>
  );
};

export default Inventory;
