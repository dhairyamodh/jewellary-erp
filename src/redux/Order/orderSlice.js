// orderSlice.js
import { createSlice } from '@reduxjs/toolkit';
import {
  createOrderAsyncCase,
  getOrderByIdCase,
  getOrdersAsyncCase
} from './orderThunk';

// Define the initial state for the slice
const initialState = {
  data: [],
  details: {},
  loading: false,
  error: null
};

// Create a slice
const orderSlice = createSlice({
  name: 'api',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    getOrderByIdCase(builder);
    createOrderAsyncCase(builder);
    getOrdersAsyncCase(builder);
  }
});

export default orderSlice.reducer;
