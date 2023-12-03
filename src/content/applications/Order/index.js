import { Helmet } from 'react-helmet-async';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Box, Button, Container, Grid, Typography } from '@mui/material';
import OrdersTable from './OrdersTable';
import { Link } from 'react-router-dom';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';

function Orders() {
  return (
    <>
      <Helmet>
        <title>Orders</title>
      </Helmet>
      <PageTitleWrapper>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom>
              Orders
            </Typography>
          </Grid>
          <Grid item>
            <Link to="/order/add">
              <Button
                sx={{ mt: { xs: 2, md: 0 } }}
                variant="contained"
                startIcon={<AddTwoToneIcon fontSize="small" />}
              >
                Create Order
              </Button>
            </Link>
          </Grid>
        </Grid>
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Box pb={4}>
          <OrdersTable />
        </Box>
      </Container>
    </>
  );
}

export default Orders;
