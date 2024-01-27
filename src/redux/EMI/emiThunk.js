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

export const createEMIAsync = createAsyncThunk(
  '/emi/add-emitransaction',
  async (req, { dispatch }) => {
    try {
      const response = await axiosClient.post('/emi/add-emitransaction', req);
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
            message: response?.data?.error,
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

export const addEMIPaymentAsync = createAsyncThunk(
  '/emi/update-emi',
  async (req, { dispatch }) => {
    try {
      const response = await axiosClient.put(
        `/emi/update-emi/${req.id}`,
        req.data
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
            message: response?.data?.error,
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

export const withdrawEMIAsync = createAsyncThunk(
  `/emi/withdraw`,
  async ({ id }, { dispatch }) => {
    try {
      const response = await axiosClient.put(`/emi/withdraw/${id}`);
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

export const createEMIAsyncCase = (builder) => {
  builder
    .addCase(createEMIAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(createEMIAsync.fulfilled, (state) => {
      state.loading = false;
    })
    .addCase(createEMIAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
};
