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

export const getProviders = createAsyncThunk<any, string, {}>(
  'products/fetchProviders',
  async (query, { rejectWithValue }) => {
    const response = await getRequest({ endpoint: `/providers?${query}` });
    if (!response.data) {
      return rejectWithValue(response?.error?.message);
    }
    return response.data;
  }
);

const getProvidersSlice = createSlice({
  name: 'fetchProviders',
  initialState,
  reducers: {
    pushToProvidersList: (state, action) => {
      state.provides = [...state.provides, action.payload];
    },
    sliceToProvidersList: (state, action) => {
      state.provides = state.provides.filter((el) => el.id !== action.payload);
    },
    cleanupProviders: (state) => {
      state.provides = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getProviders.pending, (state) => {
      state.status = 'pending';
    });
    builder.addCase(getProviders.fulfilled, (state, action) => {
      state.status = 'success';
      state.provides = action.payload?.data?.provides;
      state.meta = action.payload?.data?.meta;
    });
    builder.addCase(getProviders.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });
  },
});

export const { pushToProvidersList, sliceToProvidersList, cleanupProviders } = getProvidersSlice.actions;
export default getProvidersSlice.reducer;
