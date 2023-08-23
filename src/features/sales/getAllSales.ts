import { getRequest } from '@/lib/api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface InitialState {
  allSales: Sale[] | [];
  meta: { pages: number; count: number };
  status: 'idle' | 'success' | 'pending' | 'failed';
  error?: any;
}

const initialState: InitialState = {
  allSales: [],
  status: 'idle',
  error: undefined,
  meta: {
    count: 0,
    pages: 0,
  },
};

export const getAllSales = createAsyncThunk<any, string, {}>(
  'products/fetchAllSales',
  async (query, { rejectWithValue }) => {
    const response = await getRequest({ endpoint: `/sales?${query}` });
    if (!response.data) {
      return rejectWithValue(response?.error?.message);
    }
    return response.data;
  }
);

const getAllSaleSlice = createSlice({
  name: 'fetchAllSales',
  initialState,
  reducers: {
    pushToAllSalesList: (state, action) => {
      state.allSales = [...state.allSales, action.payload.sales];
    },
    sliceToAllSalesList: (state, action) => {
      state.allSales = state.allSales.filter((el) => el.id !== action.payload);
    },
    cleanupAllSales: (state) => {
      state.allSales = [];
    },
    updateAllSales: (state, action) => {
      const index = state.allSales.findIndex((el) => el.id === action.payload.id);
      state.allSales[index] = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllSales.pending, (state) => {
      state.status = 'pending';
    });
    builder.addCase(getAllSales.fulfilled, (state, action) => {
      state.status = 'success';
      state.allSales = action.payload?.data?.sales;
      state.meta = action.payload?.data?.meta;
    });
    builder.addCase(getAllSales.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });
  },
});

export const { pushToAllSalesList, sliceToAllSalesList, updateAllSales, cleanupAllSales } = getAllSaleSlice.actions;
export default getAllSaleSlice.reducer;
