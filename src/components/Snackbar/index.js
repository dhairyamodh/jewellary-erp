import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeSnackbar } from '../../redux/Snackbar/snackbarSlice';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Slide } from '@mui/material';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}

const SnackbarComp = () => {
  const dispatch = useDispatch();
  const { open, message, severity } = useSelector((state) => state.snackbar);

  const handleCloseSnackbar = () => {
    dispatch(closeSnackbar());
  };

  const [transition, setTransition] = React.useState(undefined);

  useEffect(() => {
    if (open) {
      setTransition(() => TransitionUp);
    }
  }, [open]);

  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        TransitionComponent={transition}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <div>
          <Alert onClose={handleCloseSnackbar} severity={severity}>
            {message}
          </Alert>
        </div>
      </Snackbar>
    </div>
  );
};

export default SnackbarComp;
