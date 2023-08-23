import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface StepperState {
  step: number;
  loading: boolean;
}

const initialState: StepperState = {
  step: 0,
  loading: false,
};

const stepperSlice = createSlice({
  name: 'stepper',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    changeStep: (state, action: PayloadAction<number>) => {
      state.step = action.payload;
    },
    nextStep: (state) => {
      state.step = state.step + 1;
    },
    prevStep: (state) => {
      state.step = state.step - 1;
    },
  },
});

export const { changeStep, setLoading, nextStep, prevStep } = stepperSlice.actions;
export default stepperSlice.reducer;
