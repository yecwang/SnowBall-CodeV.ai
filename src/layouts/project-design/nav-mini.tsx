// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
// theme
import { hideScroll } from 'src/theme/css';
// components
import { NavSectionMini } from 'src/components/nav-section';
//
import { NAV, HEADER } from '../config-layout';
import { useNavData } from './config-navigation';
import { NavToggleButton } from '../_common';

// ----------------------------------------------------------------------

export default function NavMini() {
  const navData = useNavData();

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_MINI },
        mt: `${HEADER.H_HEADER_TOOLBAR}px`,
        background: (theme) => theme.palette.background.gradient,
      }}
    >
      <NavToggleButton
        sx={{
          left: NAV.W_MINI - 20,
        }}
      />

      <Stack
        sx={{
          pb: 2,
          height: 1,
          position: 'fixed',
          width: NAV.W_MINI,
          borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          ...hideScroll.x,
        }}
      >
        <NavSectionMini
          data={navData}
          config={{
            currentRole: 'admin',
          }}
        />
      </Stack>
    </Box>
  );
}
