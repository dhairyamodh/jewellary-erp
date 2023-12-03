import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from 'src/client/axiosClient';
import { openSnackbar } from '../Snackbar/snackbarSlice';

// Create an async thunk for making the API call
export const getTransactionById = createAsyncThunk(
  '/transaction/get-transaction',
  async () => {
    try {
      const response = await axiosClient.get('/transaction/get-transaction/1');
      const data = await response.json();
      return data;
    } catch (error) {
      throw Error(error.message);
    }
  }
);

export const createOrderAsync = createAsyncThunk(
  '/transaction/create',
  async (req, { dispatch }) => {
    try {
      const response = await axiosClient.post(
        '/transaction/add-transaction',
        req
      );
      if (response.data.success) {
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
      return response;
    } catch (error) {
      throw Error(error.message);
    }
  }
);

export const getTransactionByIdCase = (builder) => {
  builder
    .addCase(getTransactionById.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getTransactionById.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    })
    .addCase(getTransactionById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
};

export const createOrderAsyncCase = (builder) => {
  builder
    .addCase(createOrderAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(createOrderAsync.fulfilled, (state) => {
      state.loading = false;
    })
    .addCase(createOrderAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
};
