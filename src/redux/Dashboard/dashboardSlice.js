// dashboardSlice.js
import { createSlice } from '@reduxjs/toolkit';

const dashboardSlice = createSlice({
  name: 'auth',
  initialState: {
    loading: false,
    error: null,
    data: {
      order: {
        count: 200,
        pending: 15,
        revenue: 145600
      },
      loan: {
        count: 347,
        pending: 159,
        revenue: 275600
      },
      emi: {
        count: 123,
        pending: 89,
        revenue: 45600
      },
      orderChart: [
        {
          name: 'Total Orders',
          data: [28, 47, 41, 34, 69, 91, 49, 82, 52, 72, 32, 99]
        },
        {
          name: 'Revenue',
          data: [
            3867, 8566, 6434, 4090, 9712, 8245, 5878, 4223, 5589, 4656, 5734,
            7017
          ]
        }
      ]
    }
  },
  reducers: {},
  extraReducers: () => {}
});

export default dashboardSlice.reducer;
