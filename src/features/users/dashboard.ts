import { getRequest } from '@/lib/api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface Dashboard {
  totalAmount: number;
  amountDue: number;
  amountPaid: number;
  provides: number;
  sales: number;
  stock: number;
  beneficiary: number;
}

interface InitialState {
  dashboard: Dashboard | null;
  meta: { pages: number; count: number };
  status: 'idle' | 'success' | 'pending' | 'failed';
  error?: any;
}

const initialState: InitialState = {
  dashboard: null,
  status: 'idle',
  error: undefined,
  meta: {
    count: 0,
    pages: 0,
  },
};

export const getDashboard = createAsyncThunk<any, string, {}>(
  'users/fetchDashboard',
  async (query, { rejectWithValue }) => {
    const response = await getRequest({ endpoint: `/users/get/inventory?${query}` });
    if (!response.data) {
      return rejectWithValue(response?.error?.message);
    }
    return response.data;
  }
);

const getDashboardSlice = createSlice({
  name: 'fetchDashboard',
  initialState,
  reducers: {
    cleanupDashboard: (state) => {
      state.dashboard = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getDashboard.pending, (state) => {
      state.status = 'pending';
    });
    builder.addCase(getDashboard.fulfilled, (state, action) => {
      state.status = 'success';
      state.dashboard = action.payload;
      state.meta = action.payload?.data?.meta;
    });
    builder.addCase(getDashboard.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });
  },
});

export const { cleanupDashboard } = getDashboardSlice.actions;
export default getDashboardSlice.reducer;
