import { createSlice } from '@reduxjs/toolkit';

const storeSlice = createSlice({
  name: 'store',
  initialState: {},
  reducers: {
    setStoreInfo: (state, {payload}) => {      
      state = payload;
      return { ...state, ...payload }
    },
    getStoreInfo: (state) => state
  },
});

export const { setStoreInfo, getStoreInfo } = storeSlice.actions;
export default storeSlice.reducer;