import { useContext } from 'react';

import {
  Box,
  alpha,
  lighten,
  IconButton,
  Tooltip,
  styled,
  useTheme,
  Typography
} from '@mui/material';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import { SidebarContext } from 'src/contexts/SidebarContext';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';

// import HeaderButtons from './Buttons';
import HeaderUserbox from './Userbox';
import { useSelector } from 'react-redux';
import { ThemeContext } from 'src/theme/ThemeProvider';
import { DarkMode, LightMode } from '@mui/icons-material';

const HeaderWrapper = styled(Box)(
  ({ theme }) => `
        height: ${theme.header.height};
        color: ${theme.header.textColor};
        padding: ${theme.spacing(0, 2)};
        right: 0;
        z-index: 6;
        background-color: ${alpha(theme.header.background, 0.95)};
        backdrop-filter: blur(3px);
        position: fixed;
        justify-content: space-between;
        width: 100%;
        @media (min-width: ${theme.breakpoints.values.lg}px) {
            left: ${theme.sidebar.width};
            width: auto;
        }
`
);

const TitleWrapper = styled(Box)(
  ({ theme }) => `
        img {
          width: 70px;
        }

        @media (min-width: ${theme.breakpoints.values.md}px) {
          img {
            display: none;
          }
        }
        @media (max-width: ${theme.breakpoints.values.md}px) {
          .MuiTypography-root {
            display: none;
          }
        }
`
);

function Header() {
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);
  const { themeName, setThemeName } = useContext(ThemeContext);
  const theme = useTheme();
  const user = useSelector((state) => state.auth.user);
  const isDark = themeName === 'NebulaFighterTheme';
  return (
    <HeaderWrapper
      display="flex"
      alignItems="center"
      sx={{
        justifyContent: 'space-between',
        boxShadow:
          theme.palette.mode === 'dark'
            ? `0 1px 0 ${alpha(
                lighten(theme.colors.primary.main, 0.7),
                0.15
              )}, 0px 2px 8px -3px rgba(0, 0, 0, 0.2), 0px 5px 22px -4px rgba(0, 0, 0, .1)`
            : `0px 2px 8px -3px ${alpha(
                theme.colors.alpha.black[100],
                0.2
              )}, 0px 5px 22px -4px ${alpha(
                theme.colors.alpha.black[100],
                0.1
              )}`
      }}
    >
      <TitleWrapper>
        <Typography variant="h3">{user?.shopName}</Typography>
        <img
          src="/logo-transparent-png.png"
          alt="logo"
          style={{
            filter: isDark ? 'invert(0%)' : 'invert(100%)'
          }}
        />
      </TitleWrapper>
      <Box display="flex" alignItems="center" justifyContent="end">
        <Tooltip arrow title={`Toggle ${isDark ? 'Light' : 'Dark'} Mode`}>
          <IconButton
            onClick={() =>
              setThemeName(isDark ? 'PureLightTheme' : 'NebulaFighterTheme')
            }
          >
            {isDark ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Tooltip>
        <HeaderUserbox />
        <Box
          component="span"
          sx={{
            ml: {
              xs: 0,
              sm: 2
            },
            display: { lg: 'none', xs: 'inline-block' }
          }}
        >
          <Tooltip arrow title="Toggle Menu">
            <IconButton color="primary" onClick={toggleSidebar}>
              {!sidebarToggle ? (
                <MenuTwoToneIcon fontSize="small" />
              ) : (
                <CloseTwoToneIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </HeaderWrapper>
  );
}

export default Header;
