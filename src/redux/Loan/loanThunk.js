import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from 'src/client/axiosClient';
import { openSnackbar } from '../Snackbar/snackbarSlice';

// Create an async thunk for making the API call

export const getLoanListAsync = createAsyncThunk(
  '/loan/getLoanData',
  async (data) => {
    try {
      const response = await axiosClient.request({
        method: 'get',
        url: `/loan/getLoanData`,
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

export const updateInterestAsync = createAsyncThunk(
  '/loan/update-interest',
  async ({ id }) => {
    try {
      const response = await axiosClient.put(`/loan/update-interest/${id}`);
      return response;
    } catch (error) {
      throw Error(error.message);
    }
  }
);

export const addLoanAmountAsync = createAsyncThunk(
  `/loan/update-loantransaction`,
  async (req, { dispatch }) => {
    try {
      const response = await axiosClient.put(
        `/loan/update-loantransaction/${req.id}`,
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

export const discountLoanAsync = createAsyncThunk(
  `/loan/discountLoan`,
  async (req, { dispatch }) => {
    try {
      const response = await axiosClient.put(
        `/loan/discountLoan/${req.id}`,
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

export const getLoanListAsyncCase = (builder) => {
  builder
    .addCase(getLoanListAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getLoanListAsync.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload?.data?.results;
      state.count = action.payload?.data.count;
    })
    .addCase(getLoanListAsync.rejected, (state, action) => {
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

export const updateInterestAsyncCase = (builder) => {
  builder
    .addCase(updateInterestAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateInterestAsync.fulfilled, (state, action) => {
      state.loading = false;
      state.details = action.payload?.data?.results;
    })
    .addCase(updateInterestAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
};

export const addLoanAmountAsyncCase = (builder) => {
  builder
    .addCase(addLoanAmountAsync.pending, (state) => {
      state.error = null;
    })
    .addCase(addLoanAmountAsync.fulfilled, (state, action) => {
      state.loading = false;
      state.details = action.payload?.data?.results;
    })
    .addCase(addLoanAmountAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
};
