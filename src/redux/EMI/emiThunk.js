import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from 'src/client/axiosClient';
import { openSnackbar } from '../Snackbar/snackbarSlice';

// Create an async thunk for making the API call

export const getEmiListAsync = createAsyncThunk(
  '/emi/get-emitransaction',
  async (data) => {
    try {
      const response = await axiosClient.request({
        method: 'get',
        url: `/emi/get-emitransaction`,
        params: data
      });
      return response;
    } catch (error) {
      throw Error(error.message);
    }
  }
);

export const createLoanAsync = createAsyncThunk(
  '/loan/create',
  async (req, { dispatch }) => {
    try {
      const response = await axiosClient.post('/loan/add-loan', req);
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

// Builder Cases

export const getEmiListAsyncCase = (builder) => {
  builder
    .addCase(getEmiListAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getEmiListAsync.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload?.data?.results;
      state.count = action.payload?.data.count;
    })
    .addCase(getEmiListAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
};

export const createLoanAsyncCase = (builder) => {
  builder
    .addCase(createLoanAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(createLoanAsync.fulfilled, (state) => {
      state.loading = false;
    })
    .addCase(createLoanAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
};
