import { getRequest } from '@/lib/api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface InitialState {
  products: Product[] | [];
  meta: { pages: number; count: number };
  status: 'idle' | 'success' | 'pending' | 'failed';
  error?: any;
  edit: string;
  supply: string;
}

const initialState: InitialState = {
  products: [],
  status: 'idle',
  error: undefined,
  meta: {
    count: 0,
    pages: 0,
  },
  edit: '',
  supply: '',
};

export const getProducts = createAsyncThunk<any, string, {}>(
  'products/fetchProducts',
  async (query, { rejectWithValue }) => {
    const response = await getRequest({ endpoint: `/products?${query}` });
    if (!response.data) {
      return rejectWithValue(response?.error?.message);
    }
    return response.data;
  }
);

const getProductsSlice = createSlice({
  name: 'fetchProducts',
  initialState,
  reducers: {
    pushToProductsList: (state, action) => {
      state.products = [action.payload, ...state.products];
    },
    sliceToProductsList: (state, action) => {
      state.products = state.products.filter((el) => el.id !== action.payload);
    },
    updateProductsList: (state, action) => {
      const index = state.products.findIndex((el) => el.id === action.payload?.id);
      state.products[index] = action.payload;
    },
    setEdit: (state, action) => {
      state.edit = action.payload;
    },
    setSupply: (state, action) => {
      state.supply = action.payload;
    },
    cleanupProducts: (state) => {
      state.products = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getProducts.pending, (state) => {
      state.status = 'pending';
    });
    builder.addCase(getProducts.fulfilled, (state, action) => {
      state.status = 'success';
      state.products = action.payload?.data?.products;
      state.meta = action.payload?.data?.meta;
    });
    builder.addCase(getProducts.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });
  },
});

export const { pushToProductsList, setSupply, setEdit, updateProductsList, sliceToProductsList, cleanupProducts } =
  getProductsSlice.actions;
export default getProductsSlice.reducer;
