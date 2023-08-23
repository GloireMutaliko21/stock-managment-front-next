import { getRequest } from '@/lib/api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface InitialState {
  categories: Category[] | [];
  status: 'idle' | 'success' | 'pending' | 'failed';
  error?: any;
}

const initialState: InitialState = {
  categories: [],
  status: 'idle',
  error: undefined,
};

export const getCategories = createAsyncThunk<any, string, {}>(
  'categories/fetchCategories',
  async (search, { rejectWithValue }) => {
    const response = await getRequest({ endpoint: `/categories?search=${search}` });
    if (!response.data) {
      return rejectWithValue(response?.error?.message);
    }
    return response.data;
  }
);

const getCategoriesSlice = createSlice({
  name: 'fetchCategories',
  initialState,
  reducers: {
    pushToCategoriesList: (state, action) => {
      state.categories = [...state.categories, action.payload];
    },
    updateCategoriesList: (state, action) => {
      const index = state.categories.findIndex((el) => el.id === action.payload?.id);
      state.categories[index] = action.payload;
    },
    cleanupCategories: (state) => {
      state.categories = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCategories.pending, (state) => {
      state.status = 'pending';
    });
    builder.addCase(getCategories.fulfilled, (state, action) => {
      state.status = 'success';
      state.categories = action.payload;
    });
    builder.addCase(getCategories.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });
  },
});

export const { pushToCategoriesList, updateCategoriesList, cleanupCategories } = getCategoriesSlice.actions;
export default getCategoriesSlice.reducer;
