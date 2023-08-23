import { createSlice } from '@reduxjs/toolkit';

interface InitialState {
  currentUser: { user: User; jwt: string; isLoggedIn: boolean } | null;
  status: 'idle' | 'success' | 'pending' | 'failed';
  error?: any;
}

const initialState: InitialState = {
  currentUser: null,
  status: 'idle',
  error: undefined,
};

const getCurrentUserSlice = createSlice({
  name: 'fetchCurrentUser',
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    cleanupCurrentUser: (state) => {
      state.currentUser = null;
    },
  },
});

export const { setCurrentUser, cleanupCurrentUser } = getCurrentUserSlice.actions;
export default getCurrentUserSlice.reducer;
