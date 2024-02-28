import {
  Box,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Typography,
  styled
} from '@mui/material';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import Text from 'src/components/Text';
import { RUPEE_SYMBOL } from 'src/utils/constants';

const LinearProgressWrapper = styled(LinearProgress)(
  ({ theme }) => `
        flex-grow: 1;
        height: 10px;
        
        &.MuiLinearProgress-root {
          background-color: ${theme.colors.alpha.black[10]};
        }
        
        .MuiLinearProgress-bar {
          border-radius: ${theme.general.borderRadiusXl};
        }
`
);

function TeamOverview() {
  const { data } = useSelector((state) => state.dashboard);
  const percentages = useMemo(() => {
    return {
      order:
        (parseFloat(data?.order?.pending) / parseFloat(data?.order?.count)) *
        100,
      loan:
        (parseFloat(data?.loan?.pending) / parseFloat(data?.loan?.count)) * 100,
      emi: (parseFloat(data?.emi?.pending) / parseFloat(data?.emi?.count)) * 100
    };
  }, [data]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent display="flex" alignItems="center" pb={3}>
            <Box pb={2}>
              <Typography variant="subtitle1" noWrap>
                Orders
              </Typography>
              <Typography variant="h3" noWrap gutterBottom>
                {RUPEE_SYMBOL}
                {data?.order?.revenue?.toLocaleString()}
              </Typography>
            </Box>

            <Typography variant="subtitle2" gutterBottom>
              <Text color="black">{data?.order?.pending}</Text> out of{' '}
              <Text color="black">{data?.order?.count}</Text> orders pending
            </Typography>
            <LinearProgressWrapper
              value={percentages?.order}
              color="primary"
              variant="determinate"
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent display="flex" alignItems="center" pb={3}>
            <Box pb={2}>
              <Typography variant="subtitle1" noWrap>
                Loans
              </Typography>
              <Typography variant="h3" noWrap gutterBottom>
                {RUPEE_SYMBOL}
                {data?.loan?.revenue?.toLocaleString()}
              </Typography>
            </Box>

            <Typography variant="subtitle2" gutterBottom>
              <Text color="black">{data?.loan?.pending}</Text> out of{' '}
              <Text color="black">{data?.loan?.count}</Text> loans pending
            </Typography>
            <LinearProgressWrapper
              value={percentages?.loan}
              color="primary"
              variant="determinate"
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent display="flex" alignItems="center" pb={3}>
            <Box pb={2}>
              <Typography variant="subtitle1" noWrap>
                EMIs
              </Typography>
              <Typography variant="h3" noWrap gutterBottom>
                {RUPEE_SYMBOL}
                {data?.emi?.revenue?.toLocaleString()}
              </Typography>
            </Box>

            <Typography variant="subtitle2" gutterBottom>
              <Text color="black">{data?.emi?.pending}</Text> out of{' '}
              <Text color="black">{data?.emi?.count}</Text> emi's pending
            </Typography>
            <LinearProgressWrapper
              value={percentages?.emi}
              color="primary"
              variant="determinate"
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default TeamOverview;
