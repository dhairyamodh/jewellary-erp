// settingSlice.js
import { createSlice } from '@reduxjs/toolkit';

const settingSlice = createSlice({
  name: 'setting',
  initialState: {
    loading: false,
    error: null,
    open: false,
    data: {
      goldRate: 64175,
      silverRate: 742
    }
  },
  reducers: {
    setToggleModal: (state) => {
      state.open = !state.open;
    }
  },
  extraReducers: () => {}
});

export const { setToggleModal } = settingSlice.actions;

export default settingSlice.reducer;
