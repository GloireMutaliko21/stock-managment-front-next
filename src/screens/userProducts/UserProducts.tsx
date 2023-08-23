/* eslint-disable react-hooks/exhaustive-deps */
import Input from '@/components/Input';
import SelectInput from '@/components/SelectInput';
import { cartAtom, reloadAtom, showCartAtom } from '@/features/cart';
import { cleanupMyProducts, getMyProducts } from '@/features/myProducts/getMyProducts';
import { cleanupUsers, getUsers } from '@/features/users/getUsers';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { AppDispatch } from '@/redux/store';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SearchIcon from '@mui/icons-material/Search';
import { Grid, Paper, Stack, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { useAtom } from 'jotai';
import qs from 'qs';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { cleanupCategories, getCategories } from '../../features/categories/getCategories';
import { cleanupInventory, getInventory } from '../../features/users/inventory';
import { getRequest } from '../../lib/api';
import { currency } from '../../lib/currency';
import { generatePdfProductUsers } from '../../utils/generatePdfProductUsers';
import ProductsList from './ProductsList';

type Event = { target: { value: string; name: string } };

const colors: any[] = ['success', 'secondary', 'warning'];
const labels = ["Montant d'achat", 'Montant de vente', 'Benefice'];

const UserProducts = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users } = useTypedSelector((state) => state.getUsers);
  const { currentUser } = useTypedSelector((state) => state.getCurrentUser);
  const { categories } = useTypedSelector((state) => state.getCategories);
  const { inventory } = useTypedSelector((state) => state.getInventory);
  const [cart, setCart] = useAtom(cartAtom);
  const [showCart, setShowCart] = useAtom(showCartAtom);
  const [reload, setReload] = useAtom(reloadAtom);
  const [loading, setLoading] = React.useState(false);
  const [category, setCategory] = React.useState('');
  const [name, setName] = React.useState('');
  const [userId, setUserId] = React.useState(currentUser?.user?.id);

  const [pagination, setPagination] = React.useState({
    page: 0,
    pageSize: 10,
  });

  const [search, setSearch] = React.useState('');
  const { pageSize, page } = pagination;

  const query = qs.stringify({
    _q: { skip: pageSize, page, search, category, userId },
  });

  async function handlePageChange(page: number) {
    setPagination({ ...pagination, page });
  }

  const handleChangeUser = (event: Event) => {
    setUserId(event.target.value);
    setPagination({ ...pagination, page: 0 });
  };

  const handleSearch = (e: Event) => {
    setSearch(e.target.value);
  };

  const handleGeneratePdf = async () => {
    setLoading(true);
    const response = await getRequest({
      endpoint: `/products/${userId || currentUser?.user?.id}/user-products?${qs.stringify({
        _q: { category },
      })}`,
    });

    if (!response.data) {
      setLoading(false);
      return toast.error("Error d'exportation");
    }

    if (response.data?.products?.length === 0) {
      setLoading(false);
      return toast.error('Aucune vente à exporter');
    }

    if (response.data?.data?.products?.length > 0) {
      await generatePdfProductUsers(
        response.data?.data?.products,
        users.find((el) => el.id === userId)
      );
      setLoading(false);
      toast.success('Exportation réussie');
    }
  };

  React.useEffect(() => {
    const fetchUsers = async () => {
      await dispatch(getUsers()).unwrap();
      await dispatch(getCategories('')).unwrap();
    };
    fetchUsers();
    return () => {
      dispatch(cleanupUsers());
      dispatch(cleanupCategories());
    };
  }, [userId]);

  React.useEffect(() => {
    const fetchProducts = async () => {
      await dispatch(getMyProducts({ query, userId: userId || currentUser?.user?.id })).unwrap();
      await dispatch(getInventory(qs.stringify({ search, category, userId }))).unwrap();
    };
    fetchProducts();
    return () => {
      dispatch(cleanupMyProducts());
      dispatch(cleanupInventory());
    };
  }, [search, reload, userId, page, category]);

  return (
    <>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Produits par utilisateur</Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
          <Button
            sx={{ height: 1, width: 1, py: 1.4, px: 3 }}
            variant="contained"
            startIcon={<PictureAsPdfIcon />}
            onClick={handleGeneratePdf}
          >
            {loading ? 'Exportation...' : 'Exporter'}
          </Button>
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
          <SelectInput
            name="userId"
            placeholder="Utilisateur"
            value={userId}
            data={users
              .filter((el) => el.status === 'ACTIVE')
              .map((el) => ({ id: el.id, label: `${el.firstName} ${el.lastName}`, value: el.id }))}
            handleChange={handleChangeUser}
          />
          <Input
            value={search}
            icon={<SearchIcon />}
            placeholder="Rechercher..."
            type="search"
            handleChange={handleSearch}
            name="search"
          />
        </Stack>
      </Stack>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <StatsCard data={inventory[0]?.pa} color="success" label="Montant d'achat" />
        <StatsCard data={inventory[0]?.pv} color="secondary" label="Montant de vente" />
        <StatsCard data={inventory[0]?.profit} color="warning" label="Bénéfice" />
      </Grid>
      <ProductsList handlePageChange={handlePageChange} pagination={pagination} />
    </>
  );
};

export default UserProducts;

const StatsCard = ({
  data,
  color,
  label,
}: {
  data: number;
  color: 'error' | 'disabled' | 'action' | 'inherit' | 'success' | 'secondary' | 'warning' | 'primary' | 'info';
  label: string;
}) => {
  return (
    <Grid item xs={12} md={6} lg={4}>
      <Paper
        component={Stack}
        justifyContent="space-between"
        direction={{ xs: 'column', md: 'row' }}
        alignItems="center"
        spacing={2}
        sx={{ p: 2 }}
        variant="outlined"
      >
        <InsertChartIcon color={color} sx={{ fontSize: 64 }} />
        <Stack alignItems={{ xs: 'center', md: 'flex-end' }}>
          <Typography fontWeight={700} variant="h5">
            {data ? currency.format(data) : 0}
          </Typography>
          <Typography color="text.secondary">{label}</Typography>
        </Stack>
      </Paper>
    </Grid>
  );
};
