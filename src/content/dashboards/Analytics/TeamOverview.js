import {
  Box,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Typography,
  styled
} from '@mui/material';
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
                {RUPEE_SYMBOL}3,854.15
              </Typography>
            </Box>

            <Typography variant="subtitle2" gutterBottom>
              <Text color="black">4</Text> out of <Text color="black">6</Text>{' '}
              tasks completed
            </Typography>
            <LinearProgressWrapper
              value={65}
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
                Orders
              </Typography>
              <Typography variant="h3" noWrap gutterBottom>
                {RUPEE_SYMBOL}3,854.15
              </Typography>
            </Box>

            <Typography variant="subtitle2" gutterBottom>
              <Text color="black">4</Text> out of <Text color="black">6</Text>{' '}
              tasks completed
            </Typography>
            <LinearProgressWrapper
              value={65}
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
                Orders
              </Typography>
              <Typography variant="h3" noWrap gutterBottom>
                {RUPEE_SYMBOL}3,854.15
              </Typography>
            </Box>

            <Typography variant="subtitle2" gutterBottom>
              <Text color="black">4</Text> out of <Text color="black">6</Text>{' '}
              tasks completed
            </Typography>
            <LinearProgressWrapper
              value={65}
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
