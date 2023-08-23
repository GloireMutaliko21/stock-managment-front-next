import { getRequest } from '@/lib/api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface InitialState {
  users: User[] | [];
  status: 'idle' | 'success' | 'pending' | 'failed';
  error?: any;
}

const initialState: InitialState = {
  users: [],
  status: 'idle',
  error: undefined,
};

export const getUsers = createAsyncThunk('users/fetchUsers', async (undefined, { rejectWithValue }) => {
  const response = await getRequest({ endpoint: '/users' });
  if (!response.data) {
    return rejectWithValue(response?.error?.message);
  }
  return response.data;
});

const getUsersSlice = createSlice({
  name: 'fetchUsers',
  initialState,
  reducers: {
    pushToUsersList: (state, action) => {
      state.users = [...state.users, action.payload];
    },
    updateUsersList: (state, action) => {
      const index = state.users.findIndex((el) => el.id === action.payload?.id);
      state.users[index] = action.payload;
    },
    cleanupUsers: (state) => {
      state.users = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUsers.pending, (state) => {
      state.status = 'pending';
    });
    builder.addCase(getUsers.fulfilled, (state, action) => {
      state.status = 'success';
      state.users = action.payload;
    });
    builder.addCase(getUsers.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });
  },
});

export const { pushToUsersList, updateUsersList, cleanupUsers } = getUsersSlice.actions;
export default getUsersSlice.reducer;
