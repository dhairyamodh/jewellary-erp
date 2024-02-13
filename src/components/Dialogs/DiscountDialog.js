import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Typography
} from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { discountTransactionAsync } from 'src/redux/Order/orderThunk';

const DiscountDialog = ({ open, onClose, onClick, id }) => {
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
        discountTransactionAsync({ id: id, data: { amount: data?.amount } })
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
        <DialogContent>
          <Typography mb={2} variant="h4">
            Add Discount
          </Typography>
          <Typography variant="h6" mb={2}>
            Enter discounted amount to complete this transaction
          </Typography>
          <TextField
            name="amount"
            label="Amount"
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

export default DiscountDialog;
