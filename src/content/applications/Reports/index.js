import { Helmet } from 'react-helmet-async';
import { Box, Container } from '@mui/material';
import ReportTable from './ReportTable';

function Orders() {
  return (
    <>
      <Helmet>
        <title>Orders</title>
      </Helmet>
      <Container maxWidth="lg">
        <Box py={4}>
          <ReportTable />
        </Box>
      </Container>
    </>
  );
}

export default Orders;
