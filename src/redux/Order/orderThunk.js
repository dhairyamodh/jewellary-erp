import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from 'src/client/axiosClient';
import { openSnackbar } from '../Snackbar/snackbarSlice';

// Create an async thunk for making the API call
export const getOrderById = createAsyncThunk(
  '/transaction/get-transaction',
  async ({ id }) => {
    try {
      const response = await axiosClient.get(
        `/transaction/get-transaction/${id}`
      );
      return response;
    } catch (error) {
      throw Error(error.message);
    }
  }
);

export const getOrdersAsync = createAsyncThunk(
  '/transaction/getallorders',
  async (data) => {
    try {
      const response = await axiosClient.request({
        method: 'get',
        url: `/transaction/getallorders`,
        params: data
      });
      return response;
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

export const addPaymentAsync = createAsyncThunk(
  `/update-transaction`,
  async (req, { dispatch }) => {
    try {
      const response = await axiosClient.put(
        `/transaction/update-transaction/${req.id}`,
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

export const cancelOrderAsync = createAsyncThunk(
  `/cancel-order`,
  async ({ id }, { dispatch }) => {
    try {
      const response = await axiosClient.put(`/transaction/cancel-order/${id}`);
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

export const getOrderByIdCase = (builder) => {
  builder
    .addCase(getOrderById.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getOrderById.fulfilled, (state, action) => {
      state.loading = false;
      state.details = action.payload?.data?.getdata;
    })
    .addCase(getOrderById.rejected, (state, action) => {
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

export const getOrdersAsyncCase = (builder) => {
  builder
    .addCase(getOrdersAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getOrdersAsync.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload?.data?.results;
      state.count = action.payload?.data.count;
    })
    .addCase(getOrdersAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
};
