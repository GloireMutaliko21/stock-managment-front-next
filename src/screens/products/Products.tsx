import Input from '@/components/Input';
import Modal from '@/components/Modal';
import SelectInput from '@/components/SelectInput';
import { getCategories } from '@/features/categories/getCategories';
import { onCloseModal, onLoading, onOpenModal } from '@/features/modal';
import {
  cleanupProducts,
  getProducts,
  pushToProductsList,
  setEdit,
  setSupply,
  updateProductsList,
} from '@/features/products/getProducts';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { patchRequest, postRequest } from '@/lib/api';
import { AppDispatch } from '@/redux/store';
import SearchIcon from '@mui/icons-material/Search';
import { Button, Stack, Typography } from '@mui/material';
import qs from 'qs';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import ProductsList from './ProductsList';
import { getSuppliers } from '@/features/suppliers/getSuppliers';

type Event = { target: { value: string; name: string } };

const Products = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isOpen } = useTypedSelector((state) => state.sidebar);
  const { categories, status, error } = useTypedSelector((state) => state.getCategories);
  const { suppliers } = useTypedSelector((state) => state.getSupplier);
  const { edit, supply } = useTypedSelector((state) => state.getProducts);
  const [name, setName] = React.useState('');
  const [stock, setStock] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [purchasedPrice, setPurchasedPrice] = React.useState('');
  const [sellingPrice, setSellingPrice] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [supplier, setSupplier] = React.useState('');
  const [pagination, setPagination] = React.useState({
    page: 0,
    pageSize: 10,
  });
  const [search, setSearch] = React.useState('');
  const { pageSize, page } = pagination;

  const query = qs.stringify({
    _q: { skip: pageSize, page, search },
  });

  const handleChange = (event: Event) => {
    setSearch(event.target.value);
  };

  const handleResetData = () => {
    setName('');
    setDescription('');
    setCategory('');
    setSupplier('');
    setPurchasedPrice('');
    setSellingPrice('');
    dispatch(setEdit(''));
    dispatch(setSupply(''));
  };

  const fetchCategorieAndSuppliers = async () => {
    await dispatch(getCategories('')).unwrap();
    await dispatch(getSuppliers('')).unwrap();
  };

  const handleOpenModal = async (data: Product | null) => {
    dispatch(setSupply(null));
    await fetchCategorieAndSuppliers();
    if (data) {
      setName(data.name);
      setDescription(data.description);
      setCategory(data.category.id);
      // setSupplier(data.supplier.id)
      setPurchasedPrice(data.purchasedPrice.toString());
      setSellingPrice(data.sellingPrice.toString());
      dispatch(setEdit(data.id));
    } else {
      handleResetData();
    }
    dispatch(onOpenModal());
  };

  const handleAddNew = () => {
    handleResetData();
    handleOpenModal(null);
  };

  async function handlePageChange(page: number) {
    setPagination({ ...pagination, page });
  }

  function handleConcatenateDate(newData: Product) {
    dispatch(pushToProductsList(newData));
  }

  function handleUpdateDate(updatedDate: Product) {
    dispatch(updateProductsList(updatedDate));
  }

  const handleSupplyModal = (data: Product) => {
    handleResetData();
    dispatch(onOpenModal());
    setName(data.name);
    dispatch(setSupply(data.id));
  };

  const updateData = async () => {
    const response = await patchRequest({
      endpoint: `/products/${edit}`,
      data: { name, description, purchasedPrice: +purchasedPrice, sellingPrice: +sellingPrice, category, supplier },
    });
    if (response?.error) {
      return toast.error(response.error);
    }
    toast.success('Produit modifié avec succès');
    handleUpdateDate(response.data);
  };

  const addData = async () => {
    const response = await postRequest({
      endpoint: '/products',
      data: { name, description, purchasedPrice: +purchasedPrice, sellingPrice: +sellingPrice, category, supplier },
    });
    if (response?.error) {
      return response.error?.message?.map((el: string) => toast.error(el));
    }
    toast.success('Produit créé avec succès');
    handleConcatenateDate(response.data);
  };

  const supplyProduct = async () => {
    try {
      const response = await patchRequest({
        endpoint: `/products/${supply}/supply`,
        data: { quantity: +stock, description },
      });
      if (response?.error) {
        console.log(response?.error);
        if (typeof response?.error?.message === 'string') {
          return toast.error(response.error?.message);
        }
        setStock('');
        return response.error?.message?.map((el: string) => toast.error(el));
      }
      setStock('');
      toast.success('Mise en stock effectuée avec succès');
      handleUpdateDate(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async () => {
    dispatch(onLoading(true));
    if (stock) {
      await supplyProduct();
    } else if (edit) {
      await updateData();
    } else {
      await addData();
    }
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
    const fetchProducts = async () => {
      await dispatch(getProducts(query)).unwrap();
    };
    fetchProducts();
    return () => {
      dispatch(cleanupProducts());
    };
  }, [page, search, isOpen]);

  return (
    <>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Liste de produits</Typography>
        <Stack direction="row" spacing={2}>
          <Input
            value={search}
            icon={<SearchIcon />}
            placeholder="Rechercher..."
            type="search"
            handleChange={handleChange}
            name="search"
          />
          <div>
            <Button variant="contained" sx={{ px: 3, py: 1.5, mt: 0 }} disableElevation onClick={handleAddNew}>
              Ajouter
            </Button>
          </div>
        </Stack>
      </Stack>

      {supply ? (
        <Modal title={`Mise en stock: ${name}`} size="sm" onSubmit={onSubmit}>
          <Stack spacing={2}>
            <Input
              label="Quantité"
              value={stock}
              placeholder="Entrer la quantité"
              handleChange={(e: Event) => setStock(e.target.value)}
              name="stock"
              type="number"
            />
            <Input
              label="Description"
              value={description}
              placeholder="Entrer la description du produit"
              handleChange={(e: Event) => setDescription(e.target.value)}
              name="description"
              type="textarea"
            />
          </Stack>
        </Modal>
      ) : (
        <Modal title={edit ? 'Modifier le produit' : 'Ajouter un produit'} size="sm" onSubmit={onSubmit}>
          <Stack spacing={2}>
            <Input
              label="Nom"
              value={name}
              placeholder="Entrer le nom"
              handleChange={(e: Event) => setName(e.target.value)}
              name="name"
            />
            <Stack spacing={2} direction="row">
              <Input
                label="Prix d'achat"
                value={purchasedPrice}
                placeholder="Entrer le prix d'achat"
                handleChange={(e: Event) => setPurchasedPrice(e.target.value)}
                name="purchasedPrice"
                type="number"
              />
              <Input
                label="Prix de vente"
                value={sellingPrice}
                placeholder="Entrer le prix de vente"
                handleChange={(e: Event) => setSellingPrice(e.target.value)}
                name="sellingPrice"
                type="number"
              />
            </Stack>
            <SelectInput
              name="category"
              placeholder="Sélectionner la catégorie"
              value={category}
              label="Catégorie"
              data={categories.map((el) => ({ id: el.id, label: el.name, value: el.id }))}
              handleChange={(e: Event) => setCategory(e.target.value)}
            />

            <SelectInput
              name="supplier"
              placeholder="Sélectionner le fournisseur"
              value={supplier}
              label="Fournisseur"
              data={suppliers.map((el) => ({ id: el.id, label: el.name, value: el.id }))}
              handleChange={(e: Event) => setSupplier(e.target.value)}
            />
            <Input
              label="Description"
              value={description}
              placeholder="Entrer la description du produit"
              handleChange={(e: Event) => setDescription(e.target.value)}
              name="description"
              type="textarea"
            />
          </Stack>
        </Modal>
      )}

      <ProductsList
        handleSupplyModal={handleSupplyModal}
        handlePageChange={handlePageChange}
        handleEditModal={handleOpenModal}
        pagination={pagination}
      />
    </>
  );
};

export default Products;
