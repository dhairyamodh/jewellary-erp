import { Helmet } from 'react-helmet-async';
import { Box, Container } from '@mui/material';
import LoanTable from './LoanTable';

function Loans() {
  return (
    <>
      <Helmet>
        <title>Loans</title>
      </Helmet>
      <Container maxWidth="lg">
        <Box
          py={{
            xs: 2,
            md: 3
          }}
        >
          <LoanTable />
        </Box>
      </Container>
    </>
  );
}

export default Loans;
