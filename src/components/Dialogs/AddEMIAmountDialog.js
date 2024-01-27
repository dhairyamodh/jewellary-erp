import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from '@mui/material';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { addEMIPaymentAsync } from 'src/redux/EMI/emiThunk';

const AddEMIAmountDialog = ({ open, onClose, onClick, id }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm();

  const onSubmit = (data) => {
    (async () => {
      setLoading(true);
      await dispatch(
        addEMIPaymentAsync({
          id: id,
          data: {
            transactions: [{ amount: parseFloat(data.amount) }]
          }
        })
      );
      onClick();
      setLoading(false);
    })();
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle variant="h4">Add EMI payment</DialogTitle>
        <DialogContent>
          <TextField
            name="amount"
            placeholder="Enter amount"
            fullWidth
            {...register('amount', {
              required: true
            })}
            error={Boolean(errors?.amount)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} type="button">
            Cancel
          </Button>
          <LoadingButton
            loading={loading}
            variant="contained"
            type="submit"
            sx={{
              height: '100%'
            }}
          >
            Submit
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddEMIAmountDialog;
