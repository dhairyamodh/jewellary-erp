import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from 'src/client/axiosClient';
import { downloadExcel } from 'src/utils/downloadExcel';
import { openSnackbar } from '../Snackbar/snackbarSlice';
// Create an async thunk for making the API call

export const getOrderReportAsync = createAsyncThunk(
  '/report/customDate-report',
  async (data, { dispatch }) => {
    try {
      const response = await axiosClient.request({
        method: 'get',
        url: `/report/customDate-report`,
        params: data
      });
      return response;
    } catch (error) {
      dispatch(
        openSnackbar({
          message: error?.response?.data?.msg || 'Something went wrong.',
          severity: 'error'
        })
      );
      throw Error(error.message);
    }
  }
);

export const exportExcelAsync = createAsyncThunk(
  '/report/export',
  async (data) => {
    try {
      const response = await axiosClient.request({
        method: 'get',
        url: `/report/export`,
        params: data,
        responseType: 'arraybuffer'
      });
      if (response) {
        downloadExcel(response);
      }
      return response;
    } catch (error) {
      throw Error(error.message);
    }
  }
);

// Builder Cases

export const getOrderReportAsyncCase = (builder) => {
  builder
    .addCase(getOrderReportAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getOrderReportAsync.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload?.data?.results;
      state.count = action.payload?.data.count;
    })
    .addCase(getOrderReportAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
};
