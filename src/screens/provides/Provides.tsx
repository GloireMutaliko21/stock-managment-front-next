/* eslint-disable react-hooks/exhaustive-deps */
import Input from '@/components/Input';
import { cleanupNewProducts, getNewProducts } from '@/features/newProducts/getNewProducts';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { AppDispatch } from '@/redux/store';
import SearchIcon from '@mui/icons-material/Search';
import { Stack, Typography } from '@mui/material';
import qs from 'qs';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import ProductsList from './ProductsList';

type Event = { target: { value: string; name: string } };

interface Cart {
  product: string;
  quantity: number;
  price: number;
}

const Provides = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentUser } = useTypedSelector((state) => state.getCurrentUser);

  const [pagination, setPagination] = React.useState({
    page: 0,
    pageSize: 25,
  });

  const [search, setSearch] = React.useState('');
  const { pageSize, page } = pagination;

  const query = qs.stringify({
    _q: { skip: pageSize, page, search },
  });

  async function handlePageChange(page: number) {
    setPagination({ ...pagination, page });
  }

  React.useEffect(() => {
    const fetchProducts = async () => {
      await dispatch(
        getNewProducts({ query, userId: currentUser?.user.role !== 'SELLER' ? 'all' : currentUser?.user?.id })
      ).unwrap();
    };
    fetchProducts();
    return () => {
      dispatch(cleanupNewProducts());
    };
  }, [search]);

  return (
    <>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Approvisionnement</Typography>
        <Stack direction="row" spacing={2}>
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

      <ProductsList handlePageChange={handlePageChange} pagination={pagination} />
    </>
  );
};

export default Provides;
