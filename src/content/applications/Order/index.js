import { Helmet } from 'react-helmet-async';
import { Box, Container } from '@mui/material';
import OrdersTable from './OrdersTable';

function Orders() {
  return (
    <>
      <Helmet>
        <title>Orders</title>
      </Helmet>
      <Container maxWidth="lg">
        <Box py={4}>
          <OrdersTable />
        </Box>
      </Container>
    </>
  );
}

export default Orders;
