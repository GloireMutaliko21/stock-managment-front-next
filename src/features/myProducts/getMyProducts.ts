import { getRequest } from '@/lib/api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface InitialState {
  products: MyProduct[] | [];
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

export const getMyProducts = createAsyncThunk<any, { query: string; userId?: string }, {}>(
  'products/fetchMyProducts',
  async ({ query, userId }, { rejectWithValue }) => {
    const response = await getRequest({ endpoint: `/products/${userId}/user-products?${query}` });
    if (!response.data) {
      return rejectWithValue(response?.error?.message);
    }
    return response.data;
  }
);

const getMyProductsSlice = createSlice({
  name: 'fetchMyProducts',
  initialState,
  reducers: {
    pushToMyProductsList: (state, action) => {
      state.products = [...state.products, action.payload];
    },
    sliceToMyProductsList: (state, action) => {
      state.products = state.products.filter((el) => el.id !== action.payload);
    },
    updateMyProductsList: (state, action) => {
      const index = state.products.findIndex((el) => el.id === action.payload?.id);
      state.products[index] = action.payload;
    },
    setEdit: (state, action) => {
      state.edit = action.payload;
    },
    setSupply: (state, action) => {
      state.supply = action.payload;
    },
    cleanupMyProducts: (state) => {
      state.products = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getMyProducts.pending, (state) => {
      state.status = 'pending';
    });
    builder.addCase(getMyProducts.fulfilled, (state, action) => {
      state.status = 'success';
      state.products = action.payload?.data?.products;
      state.meta = action.payload?.data?.meta;
    });
    builder.addCase(getMyProducts.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });
  },
});

export const {
  pushToMyProductsList,
  setSupply,
  setEdit,
  updateMyProductsList,
  sliceToMyProductsList,
  cleanupMyProducts,
} = getMyProductsSlice.actions;
export default getMyProductsSlice.reducer;
