import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from 'src/client/axiosClient';

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
