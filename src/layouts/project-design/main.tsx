// @mui
import Box, { BoxProps } from '@mui/material/Box';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// components
import { useSettingsContext } from 'src/components/settings';
//
import { HEADER, NAV } from '../config-layout';
// test
import { RunSimulator } from '../_common';

// ----------------------------------------------------------------------

export default function Main({ children, sx, ...other }: BoxProps) {
  const settings = useSettingsContext();

  const lgUp = useResponsive('up', 'lg');

  const isNavHorizontal = settings.themeLayout === 'horizontal';
  const isNavMini = settings.themeLayout === 'mini';
  const isLightMode = settings.themeMode === 'light';
  const background = isLightMode ? 'rgba(212,223,238,1)' : undefined;

  if (isNavHorizontal) {
    return (
      <Box
        component="main"
        sx={{
          width: 1,
          minHeight: 1,
          mt: `${HEADER.H_MOBILE + HEADER.H_HEADER_TOOLBAR}px`,
          pt: 0,
          pb: 0,
          background,
          ...sx,
        }}
        {...other}
      >
        {children}
      </Box>
    );
  }

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        minHeight: 1,
        display: 'flex',
        flexDirection: 'column',
        py: `${HEADER.H_DESKTOP}px`,
        mt: `${HEADER.H_HEADER_TOOLBAR}px`,
        ...(lgUp && {
          py: `${HEADER.H_DESKTOP}px`,
          width: `calc(100% - ${NAV.W_VERTICAL}px)`,
          ...(isNavMini && {
            width: `calc(100% - ${NAV.W_MINI}px)`,
          }),
        }),
        pt: 0,
        pb: 0,
        background,
        ...sx,
      }}
      {...other}
    >
      {children}
      {/* <RunSimulator /> */}
    </Box>
  );
}
