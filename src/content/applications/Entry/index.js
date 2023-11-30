import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Box, Container } from '@mui/material';
import Entries from './Entries';

function ApplicationsTransactions() {
  return (
    <>
      <Helmet>
        <title>Entry</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Box pb={4}>
          <Entries />
        </Box>
      </Container>
    </>
  );
}

export default ApplicationsTransactions;
