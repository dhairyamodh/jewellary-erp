import { LoadingButton } from '@mui/lab';
import {
  Backdrop,
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import {
  addLoanAmountAsync,
  updateInterestAsync
} from 'src/redux/Loan/loanThunk';
import { RUPEE_SYMBOL } from 'src/utils/constants';

const AddLoanAmount = () => {
  const { id } = useParams();
  const { details, loading } = useSelector((state) => state.loan);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const dispatch = useDispatch();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors }
  } = useForm();

  const onSubmit = (data) => {
    (async () => {
      setPaymentLoading(true);
      const res = await dispatch(
        addLoanAmountAsync({
          id,
          transaction: [{ amount: data.amount }]
        })
      );
      if (res?.payload.data.success) {
        dispatch(updateInterestAsync({ id }));
        reset();
      }
      setPaymentLoading(false);
    })();
  };

  useEffect(() => {
    if (id) {
      dispatch(updateInterestAsync({ id }));
    }
  }, [id]);

  if (loading) {
    return (
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }
  return (
    <>
      <Helmet>
        <title>Loan | Add Payment</title>
      </Helmet>
      <Container maxWidth="xl">
        <Box py={4}>
          <Card>
            <CardHeader title="Add Payment" />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Card>
                    <CardHeader title="Customer Information" />
                    <Divider />
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={3}>
                          <Typography variant="h6">Customer Name</Typography>
                          <Typography variant="h4" mt={1}>
                            {details?.customerName}
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Typography variant="h6">Customer Mobile</Typography>
                          <Typography variant="h4" mt={1}>
                            {details?.customerMobile}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="h6">Customer Address</Typography>
                          <Typography variant="h4" mt={1}>
                            {details?.customerAddress}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
                {details?.items?.length > 0 && (
                  <Grid item xs={12}>
                    <Card>
                      <CardHeader title="Items" />
                      <Divider />
                      <CardContent>
                        <TableContainer>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Weight/gm</TableCell>
                                <TableCell align="right">Price</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {details?.items?.map((row, index) => (
                                <TableRow
                                  key={index}
                                  sx={{
                                    '&:last-child td, &:last-child th': {
                                      border: 0
                                    }
                                  }}
                                >
                                  <TableCell component="th" scope="row">
                                    {row.name}
                                  </TableCell>
                                  <TableCell>{row.type}</TableCell>
                                  <TableCell>{row.quantity}</TableCell>
                                  <TableCell>{row.weight}</TableCell>
                                  <TableCell align="right">
                                    {RUPEE_SYMBOL}{' '}
                                    {row.itemCost?.toLocaleString()}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Card>
                    <CardHeader title="All Payments" />
                    <Divider />
                    <CardContent>
                      <TableContainer>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                          <TableHead>
                            <TableRow>
                              <TableCell>Amount</TableCell>
                              <TableCell>Date</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {details?.transactions?.map((row, index) => (
                              <TableRow
                                key={index}
                                sx={{
                                  '&:last-child td, &:last-child th': {
                                    border: 0
                                  }
                                }}
                              >
                                <TableCell component="th" scope="row">
                                  {row.amount}
                                </TableCell>
                                <TableCell>
                                  {moment(row.date).format('DD/MM/YY hh:mm a')}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card>
                    <CardHeader title="Add Amount" />
                    <Divider />
                    <CardContent>
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={2}>
                          <Grid item xs={6} md={4}>
                            <Typography variant="h4" fontWeight="bold">
                              Remaining Loan Amount
                            </Typography>
                          </Grid>
                          <Grid item xs={6} md={8}>
                            <Typography variant="h4" fontWeight="bold">
                              {RUPEE_SYMBOL}{' '}
                              {details?.updatedLoanCost?.toLocaleString()}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Grid container spacing={2}>
                              <Grid item xs={6} md={4}>
                                Amount
                              </Grid>
                              <Grid item xs={6} md={4}>
                                <TextField
                                  name="amount"
                                  label="Amount"
                                  fullWidth
                                  {...register('amount', {
                                    required: true
                                  })}
                                  error={Boolean(
                                    errors?.amount &&
                                      errors?.amount?.message !== ''
                                  )}
                                  helperText={errors?.amount?.message}
                                />
                              </Grid>
                              <Grid item xs={6} md={4}>
                                <LoadingButton
                                  loading={paymentLoading}
                                  variant="contained"
                                  type="submit"
                                  sx={{
                                    height: '100%'
                                  }}
                                >
                                  Submit
                                </LoadingButton>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </form>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </>
  );
};

export default AddLoanAmount;
