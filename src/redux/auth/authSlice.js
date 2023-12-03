// authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { loginAsyncCase } from './authThunk';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    token: null,
    loading: false,
    error: null,
    user: null
  },
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    }
  },
  extraReducers: (builder) => {
    loginAsyncCase(builder);
  }
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
