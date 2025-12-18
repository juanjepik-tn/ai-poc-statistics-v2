// spinnerSlice.js
import { createSlice } from '@reduxjs/toolkit';

interface SessionState {
  loading: boolean;
  user: any | null;
  token: string | null;
}

const initialState: SessionState = {
  loading: false,
  user: null,
  token: null,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    set: (state, { payload }) => {
      state.user = payload.user ?? state.user;
      state.token = payload.token ?? state.token;
    },
    get: (state) => state,
  },
});

export const { set, get } = sessionSlice.actions;
export default sessionSlice.reducer;