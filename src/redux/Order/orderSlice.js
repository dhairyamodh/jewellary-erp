// orderSlice.js
import { createSlice } from '@reduxjs/toolkit';
import {
  addPaymentAsyncCase,
  createOrderAsyncCase,
  deleteTransactionAsyncCase,
  getOrderByIdCase,
  getOrdersAsyncCase,
  getPendingOrdersAsyncCase
} from './orderThunk';

// Define the initial state for the slice
const initialState = {
  data: [],
  pendingOrders: [],
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
    getPendingOrdersAsyncCase(builder);
    createOrderAsyncCase(builder);
    getOrdersAsyncCase(builder);
    addPaymentAsyncCase(builder);
    deleteTransactionAsyncCase(builder);
  }
});

export default orderSlice.reducer;
