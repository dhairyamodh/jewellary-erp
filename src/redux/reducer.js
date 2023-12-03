// reducers.js
import { combineReducers } from '@reduxjs/toolkit';
import orderReducer from './Order/orderSlice';
import authReducer from './auth/authSlice';
import snackbarReducer from './Snackbar/snackbarSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  order: orderReducer,
  snackbar: snackbarReducer
});

export default rootReducer;
