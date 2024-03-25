import { DeleteTwoTone } from '@mui/icons-material';
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
  IconButton,
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
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import BackButton from 'src/components/BackButton';
import DeleteDialog from 'src/components/Dialogs/DeleteDialog';
import SuspenseLoader from 'src/components/SuspenseLoader';
import {
  addPaymentAsync,
  deleteTransactionAsync,
  getOrderById
} from 'src/redux/Order/orderThunk';
import { DATE_FORMAT, RUPEE_SYMBOL } from 'src/utils/constants';

const AddPayment = () => {
  const { id } = useParams();
  const { details, loading } = useSelector((state) => state.order);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const dispatch = useDispatch();
  const [openDelete, setOpenDelete] = useState({
    open: false,
    id: undefined
  });

  const handleOpenDeleteDialog = (id) => {
    setOpenDelete({
      id: id,
      open: true
    });
  };

  const handleCloseDeleteDialog = () => {
    setOpenDelete({
      id: undefined,
      open: false
    });
  };

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

  const handleDeleteTransaction = () => {
    dispatch(deleteTransactionAsync(openDelete?.id));
    handleCloseDeleteDialog();
  };

  if (loading) {
    return <SuspenseLoader />;
  }
  return (
    <>
      <DeleteDialog
        onAccept={handleDeleteTransaction}
        open={openDelete.open}
        onClose={handleCloseDeleteDialog}
      />
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
                        <Grid item md={6} xs={12}>
                          <Typography variant="caption">Due Date</Typography>
                          <Typography mt={1}>
                            {moment(details?.dueDate).format(DATE_FORMAT)}
                          </Typography>
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
                            <TableRow>
                              <TableCell colSpan="7" sx={{ textAlign: 'end' }}>
                                SubTotal
                              </TableCell>
                              <TableCell
                                sx={{
                                  textAlign: 'end'
                                }}
                              >
                                {RUPEE_SYMBOL}&nbsp;
                                {details?.subTotal?.toLocaleString()}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell colSpan="7" sx={{ textAlign: 'end' }}>
                                Tax
                              </TableCell>
                              <TableCell
                                sx={{
                                  textAlign: 'end'
                                }}
                              >
                                {RUPEE_SYMBOL}&nbsp;
                                {details?.taxAmount?.toLocaleString()}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell colSpan="7" sx={{ textAlign: 'end' }}>
                                Tax Rate
                              </TableCell>
                              <TableCell
                                sx={{
                                  textAlign: 'end'
                                }}
                              >
                                {details?.taxRate}%
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell colSpan="7" sx={{ textAlign: 'end' }}>
                                Discount
                              </TableCell>
                              <TableCell
                                sx={{
                                  textAlign: 'end'
                                }}
                              >
                                {RUPEE_SYMBOL}&nbsp;
                                {details?.discount_amount?.toLocaleString()}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell colSpan="7" sx={{ textAlign: 'end' }}>
                                Is Full Payment
                              </TableCell>
                              <TableCell
                                sx={{
                                  textAlign: 'end'
                                }}
                              >
                                {details?.isFullPayment ? 'Yes' : 'No'}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell
                                colSpan="7"
                                sx={{ textAlign: 'end', fontWeight: 600 }}
                              >
                                Grand Total
                              </TableCell>
                              <TableCell
                                sx={{
                                  textAlign: 'end',
                                  fontWeight: 600
                                }}
                              >
                                {RUPEE_SYMBOL}&nbsp;
                                {details?.total_amount?.toLocaleString()}
                              </TableCell>
                            </TableRow>
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

                {details?.transactions?.length > 0 && (
                  <Grid item xs={12}>
                    <Card>
                      <CardHeader title="All Payments" />
                      <Divider />
                      <CardContent>
                        <TableContainer>
                          <Table
                            sx={{ minWidth: 650 }}
                            aria-label="simple table"
                          >
                            <TableHead>
                              <TableRow>
                                <TableCell>Amount</TableCell>
                                <TableCell>Payment Type</TableCell>
                                <TableCell>Remark</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Actions</TableCell>
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
                                    {moment(row.date).format(
                                      'DD/MM/YY hh:mm a'
                                    )}
                                  </TableCell>
                                  <TableCell component="th" scope="row">
                                    <IconButton
                                      color="error"
                                      onClick={() =>
                                        handleOpenDeleteDialog({
                                          orderId: details._id,
                                          transactionId: row._id
                                        })
                                      }
                                    >
                                      <DeleteTwoTone />
                                    </IconButton>
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
                {details?.remainingAmount > 0 ||
                  (details?.status === 'price_not_fixed' && (
                    <Grid item xs={12}>
                      <Card>
                        <CardHeader title="Add Amount" />
                        <Divider />
                        <CardContent>
                          <form onSubmit={handleSubmit(onSubmit)}>
                            <Grid container spacing={2}>
                              <Grid item xs={6} md={4}>
                                Remaining Amount
                              </Grid>
                              <Grid item xs={6} md={8}>
                                {RUPEE_SYMBOL} {details?.remainingAmount}
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
                                          fullWidth
                                          type="number"
                                          onWheel={(e) => e.target.blur()}
                                          placeholder="Enter amount"
                                          inputProps={{
                                            step: 'any'
                                          }}
                                          {...register('amount', {
                                            required: true
                                            // validate: (value) => {
                                            //   const parsedValue = Number(value);
                                            //   const remainingAmount = Number(
                                            //     details?.remainingAmount
                                            //   );

                                            //   if (
                                            //     parsedValue > remainingAmount
                                            //   ) {
                                            //     return 'Amount should not be greater than remaining amount';
                                            //   }

                                            //   return undefined;
                                            // }
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
                                            <MenuItem value="cash">
                                              Cash
                                            </MenuItem>
                                            <MenuItem value="upi">UPI</MenuItem>
                                            <MenuItem value="card">
                                              Card
                                            </MenuItem>
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
                                          fullWidth
                                          placeholder="Type remark"
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
                  ))}
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </>
  );
};

export default AddPayment;
