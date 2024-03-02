// reducers.js
import { combineReducers } from '@reduxjs/toolkit';
import orderReducer from './Order/orderSlice';
import dashboardReducer from './Dashboard/dashboardSlice';
import loanReducer from './Loan/loanSlice';
import authReducer from './auth/authSlice';
import snackbarReducer from './Snackbar/snackbarSlice';
import reportReducer from './Report/reportSlice';
import emiReducer from './EMI/emiSlice';
import settingReducer from './Setting/settingSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  dashboard: dashboardReducer,
  order: orderReducer,
  loan: loanReducer,
  emi: emiReducer,
  report: reportReducer,
  snackbar: snackbarReducer,
  setting: settingReducer
});

export default rootReducer;
