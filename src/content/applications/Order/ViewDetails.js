import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import moment from 'moment';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import BackButton from 'src/components/BackButton';
import SuspenseLoader from 'src/components/SuspenseLoader';
import { getOrderById } from 'src/redux/Order/orderThunk';
import { RUPEE_SYMBOL } from 'src/utils/constants';

const ViewDetails = () => {
  const { id } = useParams();
  const { details, loading } = useSelector((state) => state.order);
  const dispatch = useDispatch();

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
        <title>View Details | Orders</title>
      </Helmet>
      <Container maxWidth="xl">
        <Box py={4}>
          <Card>
            <CardHeader avatar={<BackButton />} title="View Details" />
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
                            {details.customerName}{' '}
                            {`${details.remark ? `(${details.remark})` : ''}`}
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
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </>
  );
};

export default ViewDetails;
