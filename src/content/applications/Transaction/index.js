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
        <Box py={4}>
          <TransactionsTable />
        </Box>
      </Container>
    </>
  );
}

export default Transactions;
