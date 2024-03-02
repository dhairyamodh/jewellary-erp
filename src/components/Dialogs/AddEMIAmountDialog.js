import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useState } from 'react';
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
            transactions: [{ ...data, amount: parseFloat(data.amount) }]
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
        <DialogContent>
          <Typography variant="h4" mb={2}>
            Add EMI payment
          </Typography>
          <Stack spacing={2}>
            <TextField
              name="amount"
              label="Amount"
              fullWidth
              inputProps={{
                step: 'any'
              }}
              {...register('amount', {
                required: true
              })}
              error={Boolean(errors?.amount)}
            />
            <FormControl fullWidth>
              <InputLabel id="paymentType">Payment Type</InputLabel>
              <Select
                labelId="paymentType"
                label="Payment Type"
                defaultValue="cash"
                name="type"
                {...register('paymentType', {
                  required: true
                })}
              >
                <MenuItem value="cash">Cash</MenuItem>
                <MenuItem value="upi">UPI</MenuItem>
                <MenuItem value="card">Card</MenuItem>
              </Select>
            </FormControl>
            <TextField
              name="remark"
              label="Remark"
              fullWidth
              {...register('remark')}
              error={Boolean(errors?.remark)}
            />
          </Stack>
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
