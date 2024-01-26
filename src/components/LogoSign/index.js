import {
  Box,
  // Tooltip,
  Badge,
  // tooltipClasses,
  styled,
  useTheme
} from '@mui/material';
import { Link } from 'react-router-dom';

const LogoWrapper = styled(Link)(
  ({ theme }) => `
        color: ${theme.palette.text.primary};
        display: flex;
        text-decoration: none;
        font-weight: ${theme.typography.fontWeightBold};
`
);

const LogoSignWrapper = styled(Box)(
  () => `
        width: 80px;
        img{
          width: 100%;
          height: 100%;
        }
`
);

function Logo() {
  const theme = useTheme();

  return (
    <LogoWrapper to="/">
      <Badge
        sx={{
          '.MuiBadge-badge': {
            fontSize: theme.typography.pxToRem(11),
            right: -2,
            top: 8
          }
        }}
        overlap="circular"
        color="success"
        badgeContent="1.0"
      >
        <LogoSignWrapper>
          <img src="/logo-transparent-png.png" alt="logo" />
        </LogoSignWrapper>
      </Badge>
    </LogoWrapper>
  );
}

export default Logo;
