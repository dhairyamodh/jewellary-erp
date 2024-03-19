import { Helmet } from 'react-helmet-async';
import { Box, Container } from '@mui/material';
import ReportTable from './ReportTable';

function Orders() {
  return (
    <>
      <Helmet>
        <title>Reports</title>
      </Helmet>
      <Container maxWidth="lg">
        <Box
          py={{
            xs: 2,
            md: 3
          }}
        >
          <ReportTable />
        </Box>
      </Container>
    </>
  );
}

export default Orders;
