import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from 'src/client/axiosClient';
import { openSnackbar } from '../Snackbar/snackbarSlice';

export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/auth/login', credentials);
      if (response?.data?.success) {
        dispatch(
          openSnackbar({
            message: response?.data?.msg,
            severity: 'success'
          })
        );
      } else {
        dispatch(
          openSnackbar({
            message: response?.data?.msg,
            severity: 'error'
          })
        );
      }
      return response.data;
    } catch (error) {
      return rejectWithValue('Login failed. Please check your credentials.');
    }
  }
);

export const profileAsync = createAsyncThunk(
  'auth/profile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get('/auth/profile');
      // if (response?.data?.success) {
      //   dispatch(
      //     openSnackbar({
      //       message: response?.data?.msg,
      //       severity: 'success'
      //     })
      //   );
      // } else {
      //   dispatch(
      //     openSnackbar({
      //       message: response?.data?.msg,
      //       severity: 'error'
      //     })
      //   );
      // }
      return response;
    } catch (error) {
      return rejectWithValue('Login failed. Please check your credentials.');
    }
  }
);

export const loginAsyncCase = (builder) => {
  builder
    .addCase(loginAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(loginAsync.fulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
      state.loading = false;
      state.error = null;
      state.user = action.payload.user;
    })
    .addCase(loginAsync.rejected, (state, action) => {
      state.isAuthenticated = false;
      state.token = null;
      state.loading = false;
      state.error = action.payload;
      state.user = null;
    });
};

export const profileAsyncCase = (builder) => {
  builder
    .addCase(profileAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(profileAsync.fulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      state.user = action.payload.data.user;
    })
    .addCase(profileAsync.rejected, (state, action) => {
      state.isAuthenticated = false;
      state.token = null;
      state.loading = false;
      state.error = action.payload;
      state.user = null;
    });
};
