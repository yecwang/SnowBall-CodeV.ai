import * as React from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
// locales
import { useLocales } from 'src/locales';
//
import { HEADER } from 'src/layouts/config-layout';
import { useSettingsContext } from 'src/components/settings';
import AttributeCorrelation from './attribute-correlation';
import { W_ATTRIBUTE } from '../../config';
import { Exterior } from './exterior';
import { Events } from './events';

const borderWith = 1;

export default function AnchorTemporaryDrawer() {
  const _handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const { t } = useLocales()
  const theme = useTheme();
  const settings = useSettingsContext();
  const [tabValue, setTabValue] = React.useState(0);

  const isNavHorizontal = settings.themeLayout === 'horizontal';

  const attributeTop = HEADER.H_DESKTOP + HEADER.H_HEADER_TOOLBAR + (isNavHorizontal ? HEADER.H_MOBILE : 0);
  const attributeHeight = `calc(100% - ${attributeTop}px)`;

  return (
    <Drawer
      sx={{
        width: W_ATTRIBUTE,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          top: attributeTop,
          width: W_ATTRIBUTE,
          height: attributeHeight,
          background: theme.palette.background.gradient,
          fontSize: '14px',
          boxShadow: `-2px 0px 5px 0px rgba(19,86,159,0.2)`,
          fontFamily: 'Roboto',
          borderLeft: `dashed ${borderWith}px ${theme.palette.divider}`,
          borderTop: `dashed ${borderWith}px ${theme.palette.divider}`,
        },
        position: "absolute",
      }}
      variant="persistent"
      anchor="right"
      open
    >
      <Box sx={{ borderBottom: 1, borderColor: 'divider', pl: '10px' }}>
        <Tabs value={tabValue} onChange={_handleTabChange} aria-label="basic tabs example">
          <Tab label={t('pages.attribute.exterior')} {...a11yProps(0)} />
          {/* <Tab label={t('pages.attribute.correlation')} {...a11yProps(1)} /> */}
          <Tab label={t('pages.attribute.event')} {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={tabValue} index={0}> <Exterior /> </CustomTabPanel>
      {/* <CustomTabPanel value={tabValue} index={1}>
        <AttributeCorrelation />
      </CustomTabPanel> */}
      <CustomTabPanel value={tabValue} index={1}> <Events /> </CustomTabPanel>
    </Drawer>
  );
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
