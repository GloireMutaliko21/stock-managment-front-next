import { getRequest } from '@/lib/api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface InitialState {
  suppliers: Supplie[] | [];
  meta: { pages: number; count: number };
  status: 'idle' | 'success' | 'pending' | 'failed';
  error?: any;
}

const initialState: InitialState = {
  suppliers: [],
  status: 'idle',
  error: undefined,
  meta: {
    count: 0,
    pages: 0,
  },
};

export const getSuppliers = createAsyncThunk<any, string, {}>(
  'suppliers/fectAll',
  async (search, { rejectWithValue }) => {
    const response = await getRequest({ endpoint: `/suppliers?search=${search}` });
    if (!response.data) {
      return rejectWithValue(response?.error?.message);
    }
    return response.data;
  }
);

const getSuppliersSlice = createSlice({
  name: 'fetchSuppliers',
  initialState,
  reducers: {
    pushToAllSuppliersList: (state, action) => {
      state.suppliers = [...state.suppliers, action.payload];
    },
    sliceToAllSuppliersList: (state, action) => {
      state.suppliers = state.suppliers.filter((el) => el.id !== action.payload);
    },
    cleanupSuppliers: (state) => {
      state.suppliers = [];
    },
    updateAllSuppliers: (state, action) => {
      const index = state.suppliers.findIndex((el) => el.id === action.payload.id);
      state.suppliers[index] = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getSuppliers.pending, (state) => {
      state.status = 'pending';
    });
    builder.addCase(getSuppliers.fulfilled, (state, action) => {
      state.status = 'success';
      state.suppliers = action.payload?.data?.suppliers;
      state.meta = action.payload?.data?.meta;
    });
    builder.addCase(getSuppliers.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });
  },
});

export const { pushToAllSuppliersList, sliceToAllSuppliersList, updateAllSuppliers, cleanupSuppliers } =
  getSuppliersSlice.actions;
export default getSuppliersSlice.reducer;
