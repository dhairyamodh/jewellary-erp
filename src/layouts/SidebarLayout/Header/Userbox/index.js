import { useRef, useState } from 'react';

import {
  Avatar,
  Box,
  Button,
  Divider,
  Hidden,
  Popover,
  Stack,
  Typography
} from '@mui/material';

import { styled } from '@mui/material/styles';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from 'src/redux/auth/authSlice';
import { SettingsTwoTone } from '@mui/icons-material';
import SettingsDialog from 'src/components/Dialogs/SettingsDialog';

const UserBoxButton = styled(Button)(
  ({ theme }) => `
        padding-left: ${theme.spacing(1)};
        padding-right: ${theme.spacing(1)};
`
);

const MenuUserBox = styled(Box)(
  ({ theme }) => `
        background: ${theme.colors.alpha.black[5]};
        padding: ${theme.spacing(2)};
`
);

const UserBoxText = styled(Box)(
  ({ theme }) => `
        text-align: left;
        padding-left: ${theme.spacing(1)};
`
);

const UserBoxLabel = styled(Typography)(
  ({ theme }) => `
        font-weight: ${theme.typography.fontWeightBold};
        color: ${theme.palette.secondary.main};
        display: block;
`
);

function HeaderUserbox() {
  const user = useSelector((state) => state.auth.user);

  const ref = useRef(null);
  const [isOpen, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    dispatch(logout());
  };

  const [openSetting, setOpenSetting] = useState(false);

  const handleOpenSetting = () => {
    handleClose();
    setOpenSetting(true);
  };

  const handleCloseSetting = () => {
    setOpenSetting(false);
  };

  return (
    <>
      <UserBoxButton color="secondary" ref={ref} onClick={handleOpen}>
        <Avatar variant="rounded" alt={user?.name} src={user?.avatar} />
        <UserBoxText
          sx={{
            display: {
              xs: 'none',
              sm: 'block'
            }
          }}
        >
          <UserBoxLabel variant="body1" textTransform="capitalize">
            {user?.name}
          </UserBoxLabel>
        </UserBoxText>
        <Hidden smDown>
          <ExpandMoreTwoToneIcon sx={{ ml: 1 }} />
        </Hidden>
      </UserBoxButton>
      <Popover
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <MenuUserBox sx={{ minWidth: 210 }} display="flex" alignItems="center">
          <Avatar variant="rounded" alt={user?.name} src={user?.avatar} />
          <UserBoxText>
            <UserBoxLabel variant="body1" textTransform="capitalize">
              {user?.name}
            </UserBoxLabel>
          </UserBoxText>
        </MenuUserBox>

        <Divider />
        <Stack p={1}>
          <Button
            color="secondary"
            sx={{
              justifyContent: 'start'
            }}
            fullWidth
            onClick={handleOpenSetting}
          >
            <SettingsTwoTone sx={{ mr: 1 }} />
            Settings
          </Button>
          <Button
            sx={{
              justifyContent: 'start'
            }}
            color="primary"
            fullWidth
            onClick={handleLogout}
          >
            <LockOpenTwoToneIcon sx={{ mr: 1 }} />
            Sign out
          </Button>
        </Stack>
      </Popover>
      <SettingsDialog open={openSetting} onClose={handleCloseSetting} />
    </>
  );
}

export default HeaderUserbox;
