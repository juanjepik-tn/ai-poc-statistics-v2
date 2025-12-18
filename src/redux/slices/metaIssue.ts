import { createSlice } from '@reduxjs/toolkit';

const metaIssuesAlertSlice = createSlice({
  name: 'metaIssuesAlert',
  initialState: {
    enabled: false,
  },
  reducers: {
    setMetaIssuesAlertEnabled: (state, action) => {
      state.enabled = action.payload;
    },
  },
});

export const { setMetaIssuesAlertEnabled } = metaIssuesAlertSlice.actions;
export default metaIssuesAlertSlice.reducer;