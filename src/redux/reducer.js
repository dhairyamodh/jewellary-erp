// reducers.js
import { combineReducers } from '@reduxjs/toolkit';
import orderReducer from './Order/orderSlice';
import loanReducer from './Loan/loanSlice';
import authReducer from './auth/authSlice';
import snackbarReducer from './Snackbar/snackbarSlice';
import reportReducer from './Report/reportSlice';
import emiReducer from './EMI/emiSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  order: orderReducer,
  loan: loanReducer,
  emi: emiReducer,
  report: reportReducer,
  snackbar: snackbarReducer
});

export default rootReducer;
