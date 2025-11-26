import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from '@types/index';

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;
    },
    registerSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
    },
  },
});

export const { setLoading, setError, loginSuccess, registerSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
