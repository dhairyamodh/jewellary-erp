import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Typography
} from '@mui/material';
import { useState } from 'react';
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
      <DialogContent>
        <Typography mb={2} ariant="h4">
          {'Are you sure want withdraw EMI?'}
        </Typography>
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
