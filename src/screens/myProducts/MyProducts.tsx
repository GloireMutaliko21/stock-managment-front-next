/* eslint-disable react-hooks/exhaustive-deps */
import Input from '@/components/Input';
import Modal from '@/components/Modal';
import SelectInput from '@/components/SelectInput';
import { cartAtom, reloadAtom, showCartAtom } from '@/features/cart';
import { onCloseModal, onLoading, onOpenModal } from '@/features/modal';
import { cleanupMyProducts, getMyProducts, updateMyProductsList } from '@/features/myProducts/getMyProducts';
import { cleanupUsers, getUsers } from '@/features/users/getUsers';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { postRequest } from '@/lib/api';
import { AppDispatch } from '@/redux/store';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Stack, Typography } from '@mui/material';
import Badge from '@mui/material/Badge';
import Fab from '@mui/material/Fab';
import { nanoid } from '@reduxjs/toolkit';
import { useAtom } from 'jotai';
import qs from 'qs';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useDebouncedCallback } from '../../hooks/useDebouncedCallback';
import CartModal, { Cart } from './CartModal';
import ProductsList from './ProductsList';

type Event = { target: { value: string; name: string } };

const MyProducts = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users } = useTypedSelector((state) => state.getUsers);
  const { currentUser } = useTypedSelector((state) => state.getCurrentUser);
  const [cart, setCart] = useAtom(cartAtom);
  const [showCart, setShowCart] = useAtom(showCartAtom);
  const [reload, setReload] = useAtom(reloadAtom);
  const [name, setName] = React.useState('');
  const [rest, setRest] = React.useState(0);

  const [provide, setProvide] = React.useState({
    description: '',
    quantity: '',
    recipient: '',
    product: '',
  });

  const [cartForm, setCartForm] = React.useState<Cart>({
    id: '',
    product: null,
    quantity: '',
    sellingPrice: '',
  });

  const [showModal, setShowModal] = React.useState({
    addToCart: false,
    provide: false,
  });

  const [pagination, setPagination] = React.useState({
    page: 0,
    pageSize: 10,
  });

  const [search, setSearch] = React.useState('');
  const { pageSize, page } = pagination;

  const query = qs.stringify({
    _q: { skip: pageSize, page, search },
  });

  const handleCartFormChange = (event: Event) => {
    setCartForm((state) => ({ ...state, [event.target.name]: event.target.value }));
  };

  const handleProvideChange = (event: Event) => {
    setProvide((state) => ({ ...state, [event.target.name]: event.target.value }));
  };

  const getStock = (cart: Cart[], product: Product | null) => {
    if (product) {
      const count = cart.reduce((acc, item) => {
        if (item.product?.id === product.id) {
          return acc + +item.quantity;
        }
        return acc;
      }, 0);

      if (+cartForm.quantity < 1) return product.stock - count;

      return product.stock - (count + +cartForm.quantity);
    }
    return 0;
  };

  const getPrice = (cart: Cart[], product: Product | null) => {
    if (product) {
      const count = cart.reduce((acc, item) => {
        if (item.product?.id === product.id) {
          return acc + +item.quantity * +item.sellingPrice;
        }
        return acc;
      }, 0);

      return count;
    }
    return 0;
  };

  const handleResetProvide = () => {
    setProvide({
      description: '',
      product: '',
      quantity: '',
      recipient: '',
    });
  };

  const handleShowCart = () => {
    setShowCart(true);
  };

  const handleShowProvideModal = (data: Product) => {
    setShowModal({
      addToCart: false,
      provide: true,
    });
    setName(data.name);
    setProvide((state) => ({ ...state, product: data.id }));
    dispatch(onOpenModal());
  };

  const handleShowAddToCartModal = (data: Product) => {
    setCartForm({ id: nanoid(), quantity: '', product: data, sellingPrice: data.sellingPrice.toString() });
    setShowModal({
      addToCart: true,
      provide: false,
    });
    setName(data.name);
    dispatch(onOpenModal());
  };

  async function handlePageChange(page: number) {
    setPagination({ ...pagination, page });
  }

  const onProvide = async () => {
    if (+provide.quantity < 1) {
      return toast.error('Quantité invalide');
    }

    if (getStock(cart, cartForm?.product) < 0) {
      return toast.error('Stock insuffisant');
    }

    dispatch(onLoading(true));

    try {
      const response = await postRequest({
        endpoint: '/providers',
        data: {
          ...provide,
          quantity: +provide.quantity,
          provider: currentUser?.user.id,
        },
      });

      if (response.error?.message) {
        dispatch(onLoading(false));
        return toast.error(response.error?.message);
      }
      dispatch(onLoading(false));
      toast.success('Fourni avec succès');
      dispatch(updateMyProductsList(response.data));
      dispatch(onCloseModal());
      handleResetProvide();
    } catch (error) {
      toast.error("Quelque chose s'est mal passée");
    }
  };

  const onAddToCart = () => {
    if (+cartForm.quantity < 1) {
      return toast.error('Quantité invalide');
    }

    if (getStock(cart, cartForm?.product) < 0) {
      return toast.error('Stock insuffisant');
    }
    setShowModal({
      addToCart: false,
      provide: false,
    });
    dispatch(onOpenModal());
    setCart((state) => [...state, cartForm]);
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

  const debounce = useDebouncedCallback((callback: () => Promise<void>) => {
    callback();
  }, 250);

  const handleSearch = (e: Event) => {
    setSearch(e.target.value);
  };

  React.useEffect(() => {
    const fetchProducts = async () => {
      await dispatch(getMyProducts({ query, userId: currentUser?.user?.id })).unwrap();
    };
    debounce(fetchProducts);
    return () => {
      dispatch(cleanupMyProducts());
    };
  }, [search, reload]);

  return (
    <>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Mes produits</Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Input
            value={search}
            icon={<SearchIcon />}
            placeholder="Rechercher..."
            type="search"
            handleChange={handleSearch}
            name="search"
          />
          <div>
            <Badge badgeContent={cart?.length} color="secondary">
              <Fab size="medium" onClick={handleShowCart} color="primary">
                <ShoppingCartIcon />
              </Fab>
            </Badge>
          </div>
        </Stack>
      </Stack>

      <CartModal />

      {showModal.provide && (
        <Modal title={`Approvisionnement: ${name}`} size="sm" onSubmit={onProvide}>
          <Stack spacing={2}>
            <Input
              label="Quantité"
              value={provide.quantity}
              placeholder="Entrer la quantité"
              handleChange={handleProvideChange}
              name="quantity"
              type="number"
            />
            <SelectInput
              name="recipient"
              placeholder="Sélectionner le vendeur"
              value={provide.recipient}
              label="Vendeur"
              data={users
                .filter((el) => el.id !== currentUser?.user.id && el.status === 'ACTIVE')
                .map((el) => ({ id: el.id, label: `${el.firstName} ${el.lastName}`, value: el.id }))}
              handleChange={handleProvideChange}
            />
            <Input
              label="Description"
              value={provide.description}
              placeholder="Entrer la description du produit"
              handleChange={handleProvideChange}
              name="description"
              type="textarea"
            />
          </Stack>
        </Modal>
      )}

      {showModal.addToCart && (
        <Modal title={`Ajouter au panier: ${name}`} size="sm" onSubmit={onAddToCart}>
          <Stack spacing={2}>
            <Input
              label="Quantité"
              value={cartForm.quantity}
              placeholder="Entrer la quantité"
              handleChange={handleCartFormChange}
              name="quantity"
              type="number"
            />
            <Input
              label="Prix"
              value={cartForm.sellingPrice}
              placeholder="Entrer le prix de vente"
              handleChange={handleCartFormChange}
              name="sellingPrice"
              type="number"
            />
            <Stack direction="row" spacing={2}>
              <Typography fontWeight={700} color={getStock(cart, cartForm?.product) >= 0 ? 'text.secondary' : 'error'}>
                Stock: {getStock(cart, cartForm?.product)}
              </Typography>
              <Typography fontWeight={700} color={getStock(cart, cartForm?.product) >= 0 ? 'text.secondary' : 'error'}>
                Prix: {+cartForm.quantity * +cartForm.sellingPrice}
              </Typography>
            </Stack>
          </Stack>
        </Modal>
      )}

      <ProductsList
        handlePageChange={handlePageChange}
        handleShowAddToCartModal={handleShowAddToCartModal}
        handleShowProvideModal={handleShowProvideModal}
        pagination={pagination}
      />
    </>
  );
};

export default MyProducts;
