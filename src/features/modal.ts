import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface ModalState {
  isOpen: boolean;
  loading: boolean;
}

const initialState: ModalState = {
  isOpen: false,
  loading: false,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    onOpenModal: (state) => {
      state.isOpen = true;
    },
    onCloseModal: (state) => {
      state.isOpen = false;
    },
    onLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { onOpenModal, onCloseModal, onLoading } = modalSlice.actions;
export default modalSlice.reducer;
