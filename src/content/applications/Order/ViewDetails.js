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
  Typography
} from '@mui/material';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
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
        <title>View Details | Orders</title>
      </Helmet>
      <Container maxWidth="xl">
        <Box py={4}>
          <Card>
            <CardHeader title="View Details" />
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
                            {details?.address}
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
                                  {RUPEE_SYMBOL} {row.price.toLocaleString()}
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
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </>
  );
};

export default ViewDetails;
