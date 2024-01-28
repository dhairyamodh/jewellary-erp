import { Box } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import SuspenseLoader from 'src/components/SuspenseLoader';
import { profileAsync } from 'src/redux/auth/authThunk';

const Auth = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, isAuthenticated, error } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(profileAsync());
  }, []);

  useEffect(() => {
    if (!isAuthenticated && !localStorage.getItem('token')) {
      navigate('/login');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (error) {
      navigate('/login');
    }
  }, [error]);

  if (loading) {
    return <SuspenseLoader />;
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
