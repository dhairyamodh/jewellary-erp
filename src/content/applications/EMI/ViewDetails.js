import { DeleteTwoTone } from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import BackButton from 'src/components/BackButton';
import DeleteDialog from 'src/components/Dialogs/DeleteDialog';
import SuspenseLoader from 'src/components/SuspenseLoader';
import {
  deleteTransactionAsync,
  getEMIByIdAsync
} from 'src/redux/EMI/emiThunk';

const ViewDetails = () => {
  const { id } = useParams();
  const { details, loading } = useSelector((state) => state.emi);
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

  const handleDeleteTransaction = () => {
    dispatch(deleteTransactionAsync(openDelete?.id));
    handleCloseDeleteDialog();
  };

  useEffect(() => {
    if (id) {
      dispatch(getEMIByIdAsync({ id }));
    }
  }, [id]);

  if (loading) {
    return <SuspenseLoader />;
  }

  return (
    <>
      <Helmet>
        <title>View Details | EMI</title>
      </Helmet>
      <DeleteDialog
        onAccept={handleDeleteTransaction}
        open={openDelete.open}
        onClose={handleCloseDeleteDialog}
      />
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
                                  {moment(row.date).format('DD/MM/YY hh:mm a')}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                  <IconButton
                                    color="error"
                                    onClick={() =>
                                      handleOpenDeleteDialog({
                                        emiId: details._id,
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
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </>
  );
};

export default ViewDetails;
