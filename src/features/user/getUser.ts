import { getRequest } from '@/lib/api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface InitialState {
  user: User;
  status: 'idle' | 'success' | 'pending' | 'failed';
  error?: any;
}

const initialState: InitialState = {
  user: {
    id: '',
    status: 'ACTIVE',
    email: '',
    firstName: '',
    lastName: '',
    role: 'SELLER',
  },
  status: 'idle',
  error: undefined,
};

export const getUser = createAsyncThunk<any, string, {}>('user/fetchUser', async (id, { rejectWithValue }) => {
  const response = await getRequest({ endpoint: `/users/${id}/profile` });
  if (!response.data) {
    return rejectWithValue(response?.error?.message);
  }
  return response.data;
});

const getUserSlice = createSlice({
  name: 'fetchUser',
  initialState,
  reducers: {
    updateUser: (state, action) => {
      state.user = action.payload;
    },
    cleanupUser: (state) => {
      state.user = initialState.user;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUser.pending, (state) => {
      state.status = 'pending';
    });
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.status = 'success';
      state.user = action.payload;
    });
    builder.addCase(getUser.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });
  },
});

export const { updateUser, cleanupUser } = getUserSlice.actions;
export default getUserSlice.reducer;
