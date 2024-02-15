// emiSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { createEMIAsyncCase, getEmiListAsyncCase } from './emiThunk';

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
  reducers: {
    setEmiDetails: (state, action) => {
      state.details = action.payload;
    }
  },
  extraReducers: (builder) => {
    getEmiListAsyncCase(builder);
    createEMIAsyncCase(builder);
  }
});

export const { setEmiDetails } = emiSlice.actions;

export default emiSlice.reducer;
