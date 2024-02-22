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

axiosClient.interceptors.response.use(
  function (response) {
    // Handle successful responses
    return response;
  },
  function (error) {
    // Handle error responses
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(
        'Response Error:',
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      // The request was made but no response was received
      // if (error.code === 'ERR_NETWORK') {
      //   toast
      // }
      console.error('Request Error:', error);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
    }

    // You can also throw an error or handle it in a different way based on your application's needs
    throw error;
  }
);

export default axiosClient;
