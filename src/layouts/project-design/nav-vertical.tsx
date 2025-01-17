'use client';

import { useEffect } from 'react';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
import { useSelector, useDispatch } from 'src/redux/store';
import { actions as menuNavActions } from 'src/redux/slices/menu-nav';
// components
import Scrollbar from 'src/components/scrollbar';
import { usePathname } from 'src/routes/hook';
import { NavSectionVertical } from 'src/components/nav-section';
import Logo from 'src/components/logo';
//
import PageDialog from 'src/sections/pages/dialog';
import { NAV, HEADER } from '../config-layout';
import { useNavData } from './config-navigation';
import { NavToggleButton } from '../_common';

// ----------------------------------------------------------------------

export default function NavVertical() {
  const pathname = usePathname();

  const lgUp = useResponsive('up', 'lg');

  const navData = useNavData();

  const menuNav = useSelector(store => store.menuNav);

  const dispatch = useDispatch();

  useEffect(() => {
    if (menuNav.isOpen) {
      dispatch(menuNavActions.update({ isOpen: false }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      
      {!lgUp && <Logo sx={{ mt: 3, ml: 4, mb: 1 }} /> }

      <NavSectionVertical
        data={navData}
        config={{
          currentRole: 'admin',
        }}
      />

      <Box sx={{ flexGrow: 1 }} />
      <PageDialog />
    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_VERTICAL },
        mt: `${HEADER.H_HEADER_TOOLBAR}px`,
        background: theme => theme.palette.background.gradient,
      }}
    >
      <NavToggleButton />
      {lgUp ? (
        <Stack
          sx={{
            height: 1,
            position: 'fixed',
            width: NAV.W_VERTICAL,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Stack>
      ) : (
        <Drawer
          open={menuNav.isOpen}
          onClose={() => dispatch(menuNavActions.update({ isOpen: false }))}
          PaperProps={{
            sx: {
              width: NAV.W_VERTICAL,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
