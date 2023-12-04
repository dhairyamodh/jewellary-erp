// authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { loginAsyncCase, profileAsyncCase } from './authThunk';

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
    profileAsyncCase(builder);
  }
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
