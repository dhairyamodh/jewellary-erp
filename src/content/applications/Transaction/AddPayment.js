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
import BackButton from 'src/components/BackButton';
import SuspenseLoader from 'src/components/SuspenseLoader';
import { addPaymentAsync, getOrderById } from 'src/redux/Order/orderThunk';
import { RUPEE_SYMBOL } from 'src/utils/constants';

const AddPayment = () => {
  const { id } = useParams();
  const { details, loading } = useSelector((state) => state.order);
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
        addPaymentAsync({
          id,
          transactions: [
            {
              amount: parseFloat(data.amount),
              paymentType: data.paymentType,
              remark: data.remark
            }
          ]
        })
      );
      if (res?.payload.data.success) {
        reset();
      }
      setPaymentLoading(false);
    })();
  };

  useEffect(() => {
    if (id) {
      dispatch(getOrderById({ id }));
    }
  }, [id]);

  if (loading) {
    return <SuspenseLoader />;
  }
  return (
    <>
      <Helmet>
        <title>Orders</title>
      </Helmet>
      <Container maxWidth="xl">
        <Box py={4}>
          <Card>
            <CardHeader avatar={<BackButton />} title="Add Payment" />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Card>
                    <CardHeader title="Customer Information" />
                    <Divider />
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item md={3} xs={12}>
                          <Typography variant="caption">
                            Customer Name
                          </Typography>
                          <Typography mt={1}>
                            {details?.customerName}
                          </Typography>
                        </Grid>
                        <Grid item md={3} xs={12}>
                          <Typography variant="caption">
                            Customer Mobile
                          </Typography>
                          <Typography mt={1}>
                            {details?.customerMobile}
                          </Typography>
                        </Grid>
                        <Grid item md={6} xs={12}>
                          <Typography variant="caption">
                            Customer Address
                          </Typography>
                          <Typography mt={1}>{details?.address}</Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
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
                              <TableCell>Design</TableCell>
                              <TableCell align="right">Item Rate</TableCell>
                              <TableCell align="right">Labour Charge</TableCell>
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
                                <TableCell>{row.item_no}</TableCell>
                                <TableCell align="right">
                                  {RUPEE_SYMBOL}{' '}
                                  {row.itemRate?.toLocaleString()}
                                </TableCell>
                                <TableCell align="right">
                                  {RUPEE_SYMBOL} {row.labour?.toLocaleString()}
                                </TableCell>
                                <TableCell align="right">
                                  {RUPEE_SYMBOL} {row.price?.toLocaleString()}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </Grid>
                {details?.replacement?.length > 0 && (
                  <Grid item xs={12}>
                    <Card>
                      <CardHeader title="Replacement Items" />
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
                              {details?.replacement?.map((row, index) => (
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
                                    {row?.total_Price?.toLocaleString()}
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
                              <TableCell>Payment Type</TableCell>
                              <TableCell>Remark</TableCell>
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
                                <TableCell component="th" scope="row">
                                  {row.paymentType}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                  {row.remark}
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
                {details?.remainingAmount > 0 && (
                  <Grid item xs={12}>
                    <Card>
                      <CardHeader title="Add Amount" />
                      <Divider />
                      <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)}>
                          <Grid container spacing={2}>
                            <Grid item xs={6} md={4}>
                              <Typography variant="h4" fontWeight="bold">
                                Remaining Amount
                              </Typography>
                            </Grid>
                            <Grid item xs={6} md={8}>
                              <Typography variant="h4" fontWeight="bold">
                                {RUPEE_SYMBOL} {details?.remainingAmount}
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Grid container spacing={2}>
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
                                          required: true,
                                          validate: (value) => {
                                            const parsedValue = Number(value);
                                            const remainingAmount = Number(
                                              details?.remainingAmount
                                            );

                                            if (parsedValue > remainingAmount) {
                                              return 'Amount should not be greater than remaining amount';
                                            }

                                            return undefined;
                                          }
                                        })}
                                        error={Boolean(
                                          errors?.amount &&
                                            errors?.amount?.message !== ''
                                        )}
                                        helperText={errors?.amount?.message}
                                      />
                                    </Grid>
                                  </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                  <Grid container spacing={2}>
                                    <Grid item xs={6} md={4}>
                                      Payment Type
                                    </Grid>
                                    <Grid item xs={6} md={4}>
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
                                  </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                  <Grid container spacing={2}>
                                    <Grid item xs={6} md={4}>
                                      Remark
                                    </Grid>
                                    <Grid item xs={6} md={4}>
                                      <TextField
                                        name="remark"
                                        label="Remark"
                                        fullWidth
                                        {...register('remark')}
                                        error={Boolean(errors?.remark)}
                                      />
                                    </Grid>
                                  </Grid>
                                </Grid>
                                <Grid item xs={12}>
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
                )}
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </>
  );
};

export default AddPayment;
