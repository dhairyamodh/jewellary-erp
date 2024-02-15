// loanSlice.js
import { createSlice } from '@reduxjs/toolkit';
import {
  addLoanAmountAsyncCase,
  getLoanListAsyncCase,
  updateInterestAsyncCase
} from './loanThunk';

// Define the initial state for the slice
const initialState = {
  data: [],
  details: {},
  loading: false,
  error: null
};

// Create a slice
const loanSlice = createSlice({
  name: 'api',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    getLoanListAsyncCase(builder);
    updateInterestAsyncCase(builder);
    addLoanAmountAsyncCase(builder);
  }
});

export default loanSlice.reducer;
