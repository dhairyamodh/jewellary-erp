// orderSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { createOrderAsyncCase, getTransactionById } from './orderThunk';

// Define the initial state for the slice
const initialState = {
  data: [],
  loading: false,
  error: null
};

// Create a slice
const orderSlice = createSlice({
  name: 'api',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    getTransactionById(builder);
    createOrderAsyncCase(builder);
  }
});

export default orderSlice.reducer;
