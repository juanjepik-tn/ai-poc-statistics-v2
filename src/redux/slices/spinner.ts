// spinnerSlice.js
import { createSlice } from '@reduxjs/toolkit';

const spinnerSlice = createSlice({
  name: 'spinner',
  initialState: { loading: false },
  reducers: {
    showSpinner: (state) => {
      
      state.loading = true;
    },
    hideSpinner: (state) => {
      state.loading = false;
    },
  },
});

export const { showSpinner, hideSpinner } = spinnerSlice.actions;
export default spinnerSlice.reducer;
