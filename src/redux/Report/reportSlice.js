// reportSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { getOrderReportAsyncCase } from './reportThunk';

// Define the initial state for the slice
const initialState = {
  data: [],
  details: {},
  loading: false,
  error: null
};

// Create a slice
const reportSlice = createSlice({
  name: 'api',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    getOrderReportAsyncCase(builder);
  }
});

export default reportSlice.reducer;
