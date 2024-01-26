// emiSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { getEmiListAsyncCase } from './emiThunk';

// Define the initial state for the slice
const initialState = {
  data: [],
  details: {},
  loading: false,
  error: null
};

// Create a slice
const emiSlice = createSlice({
  name: 'api',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    getEmiListAsyncCase(builder);
  }
});

export default emiSlice.reducer;
