/* eslint-disable react-hooks/exhaustive-deps */
import Input from '@/components/Input';
import SelectInput from '@/components/SelectInput';
import { cleanupAllSales, getAllSales } from '@/features/sales/getAllSales';
import { useTypedSelector } from '@/hooks/useTypedSelector';
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
import { getRequest } from '../../lib/api';
import { generatePdfSale } from '../../utils/generatePdfSale';
import SalesList from './SalesList';
dayjs.extend(utc);

type Event = { target: { value: string; name: string } };

const Sales = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { locale } = useRouter();
  const { currentUser } = useTypedSelector((state) => state.getCurrentUser);
  const { categories, status, error } = useTypedSelector((state) => state.getCategories);
  const [startDate, setStartDate] = React.useState<Dayjs | null>(null);
  const [endDate, setEndDate] = React.useState<Dayjs | null>(null);
  const [category, setCategory] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [pagination, setPagination] = React.useState({
    page: 0,
    pageSize: 10,
  });
  const [filterByStatus, setFilterByStatus] = React.useState('');

  const [search, setSearch] = React.useState('');
  const { pageSize, page } = pagination;

  const query = qs.stringify({
    _q: {
      skip: pageSize,
      page,
      search,
      seller: currentUser?.user?.id,
      status: filterByStatus,
      category,
      startDate: startDate?.utcOffset(0).endOf('day').format(),
      endDate: endDate?.utcOffset(0)?.endOf('day')?.format(),
    },
  });

  async function handlePageChange(page: number) {
    setPagination({ ...pagination, page });
  }

  const handleOtherModal = () => {};

  const handleGeneratePdf = async () => {
    setLoading(true);
    const response = await getRequest({
      endpoint: `/sales?${qs.stringify({
        _q: {
          page,
          search,
          status: filterByStatus,
          category,
          startDate: startDate?.utcOffset(0).endOf('day').format(),
          endDate: endDate?.utcOffset(0)?.endOf('day')?.format(),
          seller: currentUser?.user?.id,
        },
      })}`,
    });

    if (!response.data) {
      setLoading(false);
      return toast.error("Error d'exportation");
    }

    if (response.data?.sales?.length === 0) {
      setLoading(false);
      return toast.error('Aucune vente à exporter');
    }

    if (response.data?.data?.sales?.length > 0) {
      await generatePdfSale(response.data?.data?.sales, startDate, endDate);
      setLoading(false);
      toast.success('Exportation réussie');
    }
  };

  React.useEffect(() => {
    const fetchProducts = async () => {
      await dispatch(getCategories('')).unwrap();
    };
    fetchProducts();
    return () => {
      dispatch(cleanupCategories());
    };
  }, []);

  React.useEffect(() => {
    const fetchProducts = async () => {
      await dispatch(getAllSales(query)).unwrap();
    };
    fetchProducts();
    return () => {
      dispatch(cleanupAllSales());
    };
  }, [search, page, pageSize, filterByStatus, category, startDate, endDate]);

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
        <Grid item xs={12} md={12} lg={2}>
          <Button
            sx={{ height: 1, width: 1, py: 1.4, px: 3 }}
            variant="contained"
            startIcon={<PictureAsPdfIcon />}
            onClick={handleGeneratePdf}
          >
            {loading ? 'Exportation...' : 'Exporter'}
          </Button>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
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
        <Grid item xs={12} md={6} lg={2}>
          <SelectInput
            name="filterByStatus"
            placeholder="État"
            value={filterByStatus}
            data={[
              { value: 'pending', label: 'Impayée', id: 'pending' },
              { value: 'paid', label: 'Payée', id: 'paid' },
            ]}
            handleChange={(e: Event) => setFilterByStatus(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={2}>
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

      <SalesList handlePageChange={handlePageChange} pagination={pagination} handleOtherModal={handleOtherModal} />
    </>
  );
};

export default Sales;
