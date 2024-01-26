// reportSlice.js
import { createSlice } from '@reduxjs/toolkit';

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
  extraReducers: () => {}
});

export default reportSlice.reducer;
