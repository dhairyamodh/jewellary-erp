import PropTypes from 'prop-types';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { Box } from '@mui/material';
import { memo, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';

const BaseLayout = memo(({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const location = useLocation();
  const navigate = useNavigate();

  const nonAuthRoutes = ['/login'];

  const handleNavigation = useCallback(() => {
    if (!nonAuthRoutes.includes(location.pathname) && !isAuthenticated) {
      navigate('/login');
    }
  }, [location]);

  useEffect(() => {
    handleNavigation();
  }, [handleNavigation]);

  return (
    <Box
      sx={{
        flex: 1,
        height: '100%'
      }}
    >
      {children || <Outlet />}
    </Box>
  );
});

BaseLayout.propTypes = {
  children: PropTypes.node
};

export default BaseLayout;
