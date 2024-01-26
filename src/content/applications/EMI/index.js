import { Helmet } from 'react-helmet-async';
import { Box, Container } from '@mui/material';
import EmiTable from './EmiTable';

function EMIs() {
  return (
    <>
      <Helmet>
        <title>EMIs</title>
      </Helmet>
      <Container maxWidth="lg">
        <Box py={4}>
          <EmiTable />
        </Box>
      </Container>
    </>
  );
}

export default EMIs;
