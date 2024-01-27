import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { withdrawEMIAsync } from 'src/redux/EMI/emiThunk';

const WithdrawEMIDialog = ({ open, onClose, onClick, id }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const onAgree = () => {
    (async () => {
      setLoading(true);
      await dispatch(withdrawEMIAsync({ id }));
      onClick();
      setLoading(false);
    })();
  };
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle ariant="h4">{'Are you sure want withdraw EMI?'}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          You won't be able to revert this!
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Disagree</Button>
        <LoadingButton
          loading={loading}
          autoFocus
          variant="contained"
          onClick={onAgree}
        >
          Agree
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default WithdrawEMIDialog;
