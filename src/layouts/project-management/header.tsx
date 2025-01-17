// @mui
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
// theme
import { bgBlur } from 'src/theme/css';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// redux
import { useDispatch } from 'src/redux/store';
import { actions as menuNavActions } from 'src/redux/slices/menu-nav';
// components
import Logo from 'src/components/logo';
import SvgColor from 'src/components/svg-color';
//
import { useLocales } from 'src/locales';
import { HEADER } from '../config-layout';
import {
  AccountPopover,
  SettingsButton,
  LanguagePopover,
  NotificationsPopover,
} from '../_common';

// ----------------------------------------------------------------------

export default function Header() {
  const theme = useTheme();
  const { t } = useLocales();
  const lgUp = useResponsive('up', 'lg');

  const dispatch = useDispatch();

  const isLightMode = theme.palette.mode === 'light';

  const renderContent = (
    <>
      {lgUp && <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Logo sx={{ mr: 2.5 }} />

        <ListItemText
          disableTypography
          sx={{ textAlign: 'left' }}
          primary={
            <Typography
              sx={{
                fontSize: '20px',
                fontFamily: 'MontserratAlternates-bold',
                fontWeight: 'bold'
              }}
              noWrap
            >
              {t('header.title.primary')}
            </Typography>
          }
          secondary={
            <Typography
              sx={{
                fontSize: '14px',
                fontFamily: 'SourceHanSansSC-regular'
              }}
              noWrap
            >
              {t('header.title.secondary')}
            </Typography>
          }
        />
      </Box>}

      {!lgUp && (
        <IconButton onClick={() => dispatch(menuNavActions.update({ isOpen: true }))}>
          <SvgColor src="/assets/icons/navbar/ic_menu_item.svg" />
        </IconButton>
      )}

      <Stack
        flexGrow={1}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        spacing={{ xs: 0.5, sm: 1 }}
      >
        <LanguagePopover />

        <NotificationsPopover />

        <SettingsButton />

        <AccountPopover />
      </Stack>
    </>
  );

  return (
    <AppBar
      sx={{
        zIndex: theme.zIndex.appBar + 1,
        ...bgBlur({
          color: theme.palette.background.default,
        }),
        transition: theme.transitions.create(['height'], {
          duration: theme.transitions.duration.shorter,
        }),
        width: 1,
        height: HEADER.H_DESKTOP - 1,
        borderBottom: `dashed 1px ${theme.palette.divider}`,
        fontSize: '14px',
        textAlign: 'center',
        fontFamily: 'Roboto',
        background: isLightMode ? 'linear-gradient(180deg, rgba(244,235,255,0.8) 0%,rgba(242,246,251,0.8) 100%)' : undefined,
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 },
        }}
      >
        {renderContent}
      </Toolbar>
    </AppBar>
  );
}
