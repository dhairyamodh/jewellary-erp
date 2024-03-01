import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  TextField,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

const SettingsDialog = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  //   const dispatch = useDispatch();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors }
  } = useForm();

  const onSubmit = () => {
    (async () => {
      setLoading(true);
      //   const res = await dispatch(discountLoanAsync({ id: id, data: data }));
      setLoading(false);
    })();
  };

  useEffect(() => {
    reset();
  }, [open]);

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
          <Typography variant="h4">Settings</Typography>
          <Grid container spacing={2} pt={2}>
            <Grid item xs={12}>
              <Grid container spacing={2} alignItems="center">
                <Grid item sm={12}>
                  <TextField
                    name="goldRate"
                    label="Gold Rate"
                    placeholder="Enter the rate per gram"
                    fullWidth
                    {...register('goldRate', {
                      required: true
                    })}
                    error={Boolean(errors?.goldRate)}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2} alignItems="center">
                <Grid item sm={12}>
                  <TextField
                    name="silverRate"
                    label="Silver Rate"
                    placeholder="Enter the rate per gram"
                    fullWidth
                    {...register('silverRate', {
                      required: true
                    })}
                    error={Boolean(errors?.silverRate)}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
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
            Save changes
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SettingsDialog;
