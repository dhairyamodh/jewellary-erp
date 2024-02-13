import {
  Box,
  // tooltipClasses,
  styled
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
  return (
    <LogoWrapper to="/">
      <LogoSignWrapper>
        <img src="/logo-transparent-png.png" alt="logo" />
      </LogoSignWrapper>
    </LogoWrapper>
  );
}

export default Logo;
