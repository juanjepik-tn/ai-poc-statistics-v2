import { BillingDTO } from '@/types/billingDTO';
import { createSlice } from '@reduxjs/toolkit';

interface BillingState {
  billingData: BillingDTO | null;
}

const initialState: BillingState = {
  billingData: null,
};

const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    setBillingData: (state, { payload }) => {
      state.billingData = payload;
    },
    resetBillingData: (state) => {
      state.billingData = initialState.billingData;
    },
  },
});

export const { setBillingData, resetBillingData } = billingSlice.actions;
export default billingSlice.reducer;