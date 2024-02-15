import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createEMIAsync } from 'src/redux/EMI/emiThunk';

const CreateEMI = () => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors }
  } = useForm();

  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.emi);

  const onSubmit = (data) => {
    (async () => {
      const request = {
        customerName: data.customerName,
        customerMobile: data.customerMobile,
        address: data.address,
        transactions: [
          {
            amount: parseFloat(data.amount),
            paymentType: data.paymentType,
            remark: data.remark
          }
        ],
        fixed_Emi: parseFloat(data.fixed_Emi)
      };
      const res = await dispatch(createEMIAsync(request));
      if (res?.payload?.data?.success) {
        reset();
      }
    })();
  };

  return (
    <>
      <Helmet>
        <title>Orders</title>
      </Helmet>
      <Container maxWidth="xl">
        <Box py={4}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="stretch"
              spacing={3}
            >
              <Grid item xs={12}>
                <Card>
                  <CardHeader title="Create EMI" />
                  <Divider />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <TextField
                          name="customerName"
                          label="Customer Name"
                          fullWidth
                          {...register('customerName', {
                            required: true
                          })}
                          error={Boolean(errors?.customerName)}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          name="remark"
                          label="Remark"
                          fullWidth
                          {...register('remark')}
                          error={Boolean(errors?.remark)}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          name="customerMobile"
                          label="Customer Mobile"
                          fullWidth
                          {...register('customerMobile')}
                          error={Boolean(errors?.customerMobile)}
                        />
                      </Grid>
                      <Grid item xs={12} md={12}>
                        <TextField
                          name="address"
                          label="Customer Address"
                          fullWidth
                          {...register('address', {
                            required: true
                          })}
                          error={Boolean(errors?.address)}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        {/* <Grid container spacing={2}></Grid> */}
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Card>
                          <CardContent>
                            <Grid container spacing={2} alignItems="center">
                              <Grid item xs={6}>
                                <Typography>EMI amount</Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <TextField
                                  placeholder="Enter EMI amount"
                                  type="number"
                                  fullWidth
                                  name="fixed_Emi"
                                  {...register('fixed_Emi', {
                                    required: true
                                  })}
                                  error={Boolean(errors?.fixed_Emi)}
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <Typography>Payment Type</Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <FormControl fullWidth>
                                  <Select
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
                              </Grid>
                              <Grid item xs={6}>
                                <Typography>First EMI amount</Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <TextField
                                  placeholder="Enter first EMI amount"
                                  type="number"
                                  fullWidth
                                  name="amount"
                                  {...register('amount', {
                                    required: true
                                  })}
                                  error={Boolean(errors?.amount)}
                                />
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={12}>
                        <Box display="flex" justifyContent="end">
                          <LoadingButton
                            loading={loading}
                            variant="contained"
                            type="submit"
                          >
                            Submit
                          </LoadingButton>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Container>
    </>
  );
};

export default CreateEMI;
