import { getRequest } from '@/lib/api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface InitialState {
  provides: Provide[] | [];
  meta: { pages: number; count: number };
  status: 'idle' | 'success' | 'pending' | 'failed';
  error?: any;
}

const initialState: InitialState = {
  provides: [],
  status: 'idle',
  error: undefined,
  meta: {
    count: 0,
    pages: 0,
  },
};

export const getNewProducts = createAsyncThunk<any, { query: string; userId?: string }, {}>(
  'products/fetchNewProducts',
  async ({ query, userId }, { rejectWithValue }) => {
    const response = await getRequest({ endpoint: `/providers/${userId}/user-provides?${query}` });
    if (!response.data) {
      return rejectWithValue(response?.error?.message);
    }
    return response.data;
  }
);

const getNewProductsSlice = createSlice({
  name: 'fetchNewProducts',
  initialState,
  reducers: {
    pushToNewProductsList: (state, action) => {
      state.provides = [...state.provides, action.payload];
    },
    sliceToNewProductsList: (state, action) => {
      state.provides = state.provides.filter((el) => el.id !== action.payload);
    },
    cleanupNewProducts: (state) => {
      state.provides = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getNewProducts.pending, (state) => {
      state.status = 'pending';
    });
    builder.addCase(getNewProducts.fulfilled, (state, action) => {
      state.status = 'success';
      state.provides = action.payload?.data?.provides;
      state.meta = action.payload?.data?.meta;
    });
    builder.addCase(getNewProducts.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });
  },
});

export const { pushToNewProductsList, sliceToNewProductsList, cleanupNewProducts } = getNewProductsSlice.actions;
export default getNewProductsSlice.reducer;
