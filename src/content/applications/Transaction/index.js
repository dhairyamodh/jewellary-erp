import { Helmet } from 'react-helmet-async';
import { Box, Container } from '@mui/material';
import TransactionsTable from './TransactionsTable';

function Transactions() {
  return (
    <>
      <Helmet>
        <title>Transactions</title>
      </Helmet>
      <Container maxWidth="lg">
        <Box
          py={{
            xs: 2,
            md: 3
          }}
        >
          <TransactionsTable />
        </Box>
      </Container>
    </>
  );
}

export default Transactions;
