import { getRequest } from '@/lib/api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export interface Inventory {
  id: string;
  firstName: string;
  lastName: string;
  totalAmount: number;
  amountDue: number;
  amountPaid: number;
  provides: number;
  sales: number;
  stock: number;
  beneficiary: number;
  pa: number;
  pv: number;
  profit: number;
}

interface InitialState {
  inventory: Inventory[] | [];
  meta: { pages: number; count: number };
  status: 'idle' | 'success' | 'pending' | 'failed';
  error?: any;
}

const initialState: InitialState = {
  inventory: [],
  status: 'idle',
  error: undefined,
  meta: {
    count: 0,
    pages: 0,
  },
};

export const getInventory = createAsyncThunk<any, string, {}>(
  'users/fetchInventory',
  async (query, { rejectWithValue }) => {
    const response = await getRequest({ endpoint: `/users/get/inventory/all?${query}` });
    if (!response.data) {
      return rejectWithValue(response?.error?.message);
    }
    return response.data;
  }
);

const getInventorySlice = createSlice({
  name: 'fetchInventory',
  initialState,
  reducers: {
    pushToInventoryList: (state, action) => {
      state.inventory = [...state.inventory, action.payload];
    },
    sliceToInventoryList: (state, action) => {
      state.inventory = state.inventory.filter((el) => el.id !== action.payload);
    },
    cleanupInventory: (state) => {
      state.inventory = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getInventory.pending, (state) => {
      state.status = 'pending';
    });
    builder.addCase(getInventory.fulfilled, (state, action) => {
      state.status = 'success';
      state.inventory = action.payload?.data?.inventory || action.payload?.data;
      state.meta = action.payload?.data?.meta;
    });
    builder.addCase(getInventory.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });
  },
});

export const { pushToInventoryList, sliceToInventoryList, cleanupInventory } = getInventorySlice.actions;
export default getInventorySlice.reducer;
