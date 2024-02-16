// axiosClient.js
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL // Default API URL
});

axiosClient.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token');
  config.headers.authorization = token ? `${token}` : '';
  return config;
});

export default axiosClient;
