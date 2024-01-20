// reducers.js
import { combineReducers } from '@reduxjs/toolkit';
import orderReducer from './Order/orderSlice';
import loanReducer from './Loan/loanSlice';
import authReducer from './auth/authSlice';
import snackbarReducer from './Snackbar/snackbarSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  order: orderReducer,
  loan: loanReducer,
  snackbar: snackbarReducer
});

export default rootReducer;
