import {
  Box,
  Button,
  Card,
  CardHeader,
  Container,
  Divider,
  Grid,
  Menu,
  MenuItem,
  useTheme
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import Footer from 'src/components/Footer';

import { ExpandMoreTwoTone } from '@mui/icons-material';
import { useRef, useState } from 'react';
import OrdersAnalytics from './OrdersAnalytics';
import TeamOverview from './TeamOverview';

function Analytics() {
  const theme = useTheme();

  const periods = [
    {
      value: 'today',
      text: 'Today'
    },
    {
      value: 'yesterday',
      text: 'Yesterday'
    },
    {
      value: 'last_month',
      text: 'Last month'
    },
    {
      value: 'last_year',
      text: 'Last year'
    }
  ];
  const actionRef1 = useRef(null);
  const [openPeriod, setOpenMenuPeriod] = useState(false);
  const [period, setPeriod] = useState(periods[3].text);

  return (
    <>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <Container maxWidth="lg">
        <Box pt={4}>
          <Card variant="outlined">
            <CardHeader
              action={
                <Box>
                  <Button
                    size="small"
                    variant="contained"
                    color="secondary"
                    ref={actionRef1}
                    onClick={() => setOpenMenuPeriod(true)}
                    endIcon={<ExpandMoreTwoTone fontSize="small" />}
                  >
                    {period}
                  </Button>
                  <Menu
                    disableScrollLock
                    anchorEl={actionRef1.current}
                    onClose={() => setOpenMenuPeriod(false)}
                    open={openPeriod}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right'
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right'
                    }}
                  >
                    {periods.map((_period) => (
                      <MenuItem
                        key={_period.value}
                        onClick={() => {
                          setPeriod(_period.text);
                          setOpenMenuPeriod(false);
                        }}
                      >
                        {_period.text}
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              }
              title="Analytics"
            />
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="stretch"
              spacing={0}
            >
              <Grid item xs={12}>
                <Box p={2}>
                  <TeamOverview />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Divider />
                <Box
                  p={2}
                  sx={{
                    background: `${theme.colors.alpha.black[5]}`
                  }}
                >
                  <OrdersAnalytics />
                </Box>
                <Divider />
              </Grid>
              {/* <Grid item xs={12}>
                <Box p={2}>
                  <Projects />
                </Box>
                <Divider />
              </Grid> */}
            </Grid>
          </Card>
        </Box>
      </Container>
      <Footer />
    </>
  );
}

export default Analytics;
