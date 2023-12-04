import { Backdrop, Box, CircularProgress } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { profileAsync } from 'src/redux/auth/authThunk';

const Auth = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(profileAsync());
  }, []);

  useEffect(() => {
    if (!isAuthenticated && !localStorage.getItem('token')) {
      navigate('/');
    }
  }, [isAuthenticated, loading]);

  if (loading) {
    return (
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }
  return (
    <Box
      sx={{
        minHeight: '100vh'
      }}
    >
      {children}
    </Box>
  );
};

export default Auth;
