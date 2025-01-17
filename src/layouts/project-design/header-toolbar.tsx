// @mui
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SaveIcon from '@mui/icons-material/Save';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import TranslateIcon from '@mui/icons-material/Translate';
import RuleIcon from '@mui/icons-material/Rule';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useTheme } from '@mui/material/styles';
//
import { useLocales } from 'src/locales';
import { useSettingsContext } from 'src/components/settings';
import { NAV, HEADER } from '../config-layout';
import useHeaderToolbar from './use-header-toolbar';

export default function HeaderToolbar() {
  const _renderQuitBtn = () => (
    <Button
      sx={{
        width: '80px',
        height: '35px',
        lineHeight: '20px',
        borderRadius: '0px 20px 20px 0px',
        background: 'linear-gradient(180deg, rgba(136,136,136,1) 0%,rgba(16,16,16,1) 100%)',
        color: 'rgba(255,255,255,1)',
        fontSize: '14px',
        textAlign: 'center',
        fontFamily: 'Roboto',
        p: 0,
      }}
      startIcon={<ExitToAppIcon />}
      onClick={onQuitClick}
    >
      {t('project_design.header_toolbar.exit')}
    </Button>
  )
  const _renderFunBtn = () => {
    const menuItems = [
      { label: t('project_design.header_toolbar.save'), icon: <SaveIcon />, onClick: onSaveClick },
      { label: t('project_design.header_toolbar.export'), icon: <SystemUpdateAltIcon />, onClick: onExportClick },
      { label: t('project_design.header_toolbar.undo'), icon: <UndoIcon />, onClick: onUndoClick },
      { label: t('project_design.header_toolbar.redo'), icon: <RedoIcon />, onClick: onRedoClick },
      { label: t('project_design.header_toolbar.fullscreen'), icon: <FullscreenIcon />, onClick: onFullscreenClick },
      { label: t('project_design.header_toolbar.language'), icon: <TranslateIcon />, onClick: onLanguageClick },
      { label: t('project_design.header_toolbar.verify'), icon: <RuleIcon />, onClick: onVerifyClick },
      { label: t('project_design.header_toolbar.run'), icon: <PlayCircleOutlineIcon />, onClick: onRunClick },
      { label: t('project_design.header_toolbar.publish'), icon: <CloudUploadIcon />, onClick: onPublishClick },
    ]
    
    return <>
      {
        menuItems.map((item, index) => (
          <Button key={index} variant='text' sx={{ minWidth: '100px', px: 2 }} startIcon={item.icon} onClick={item.onClick}>
            {item.label}
          </Button>
        ))
      }
    </>;
  }

  const { t } = useLocales();
  const theme = useTheme();
  const settings = useSettingsContext();
  const isNavHorizontal = settings.themeLayout === 'horizontal';
  const isNavMini = settings.themeLayout === 'mini';
  const marginTop = isNavHorizontal ? HEADER.H_DESKTOP + HEADER.H_MOBILE : HEADER.H_DESKTOP;
  const {
    onQuitClick, onSaveClick, onExportClick, onUndoClick, onRedoClick, onFullscreenClick, onLanguageClick, onVerifyClick,
    onRunClick, onPublishClick
  } = useHeaderToolbar();

  return (
    <AppBar
      sx={{
        zIndex: theme.zIndex.appBar + 1,
        transition: theme.transitions.create(['height'], {
          duration: theme.transitions.duration.shorter,
        }),
        width: 1,
        height: HEADER.H_HEADER_TOOLBAR,
        lienHeight: HEADER.H_HEADER_TOOLBAR,

        background: theme.palette.background.gradient,
        fontSize: '13px',
        boxShadow: '0px 2px 6px 0px rgba(5,43,86,0.1)',
        fontFamily: 'Roboto',
        marginTop: `${marginTop}px`,
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 },
          padding: '0 !important'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
          }}
        >
          <Box sx={{ width: isNavMini ? NAV.W_MINI : NAV.W_VERTICAL }}>
            { _renderQuitBtn() }
          </Box>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            '& button': {
              fontSize: '14px',
              fontWeight: 'normal',
            }
          }}>
            { _renderFunBtn() }
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}