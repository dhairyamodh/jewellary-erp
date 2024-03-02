import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from 'src/client/axiosClient';
import { openSnackbar } from '../Snackbar/snackbarSlice';

export const profileAsync = createAsyncThunk(
  'auth/profile',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosClient.get('/auth/profile');
      if (!response?.data?.success) {
        dispatch(
          openSnackbar({
            message: response?.data?.msg,
            severity: 'error'
          })
        );
      }
      return response;
    } catch (error) {
      dispatch(
        openSnackbar({
          message: error?.response?.data?.msg || 'Something went wrong',
          severity: 'error'
        })
      );
      return rejectWithValue('Login failed. Please check your credentials.');
    }
  }
);
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
