'use client'

import { useCallback, useEffect, useState } from 'react';
// @mui
import Box from '@mui/material/Box';
import IconButton from "@mui/material/IconButton";
import Typography from '@mui/material/Typography';
import Paper from "@mui/material/Paper";
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import DragContainer from 'src/sections/pages/components/drag-container';
import { alpha, useTheme } from '@mui/material/styles';

// Icon
import SearchIcon from '@mui/icons-material/Search';
// eslint-disable-next-line import/no-extraneous-dependencies
import {icons as mdiIcons} from '@iconify-json/mdi';

// Custom components
import Iconify from 'src/components/iconify';
import { config as IconifyConfig } from 'src/pluginapp-context-manager/ui-lib/Iconify/config';

// hooks
import { useLocales } from 'src/locales';
import useToolbox from '../../hooks/use-toolbox';

const defaultIcons = [
  'add',
  'add-box',
  'add-circle',
  'add-circle-outline',
  'paper-add',
  'keyboard-arrow-down',
  'keyboard-arrow-up',
  'keyboard-arrow-left',
  'keyboard-arrow-right',
  'arrow-expand',
  'close',
  'close-box',
  'close-box-outline',
  'close-circle',
  'close-circle-outline',
  'menu',
  'menu-open',
  'menu-close',
  'filter-menu',
  'filter-menu-outline',
  'image-area',
  'file-image-plus',
  'image-remove',
  'image-filter-drama-outline',
  'image-search',
  'account',
  'account-circle',
  'account-box',  
  'card-account-details-outline',
  'account-group',
  'alarm',
  'content-copy',
  'settings',
  'settings-outline',
  'power',
  'power-off',
  'microphone',
  'microphone-outline',
  'microphone-off',
  'volume-high',
  'volume-medium',
  'volume-low',
  'audio',
  'audio-off',
  'video',
  'video-off',
  'video-plus',
  'message',
  'message-plus',
  'folder',
  'folder-plus',
  'paper',
  'paper-remove',
  'paper-text',
  'link'
]


export default function ToolboxIconsForm({title, onClose}: {title: string, onClose: ()=>void | undefined}) {

  const { t } = useLocales();
  const theme = useTheme();
  const [icons, setIcons] = useState<string[]>(defaultIcons);
  const [search, setSearch] = useState<string>('');

  const allIcons = Object.keys(mdiIcons.icons);

  // 添加背景色，并添加鼠标悬浮效果
  const gridItem = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '5px',
    background: alpha(theme.palette.grey[400], 0.16),
    '&:hover': {
      background: alpha(theme.palette.grey[400], 0.64),
    },
    cursor: 'pointer',
    borderRadius: '2px'
  };
  
  const onSearchClick = useCallback(() => {
    if (!search) {
      setIcons(defaultIcons);
      return;
    }
    const searchResult = allIcons.filter((icon) => icon.includes(search));
    setIcons(searchResult);
  }, [search, allIcons])

  return <>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mx: 1,
        my: 1,
        maxHeight: '400px'
      }}>
        <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          <Typography variant="h6">{title}</Typography>
        </Box>
        <Iconify onClick={onClose} icon='ei:close' width={25}/>
      </Box>
      <Paper
        variant="outlined"
        sx={{ p: '1px 2px', display: 'flex', alignItems: 'center', fontSize: '14px',
        fontWeight: 'normal' }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder={t('project_design.toolbox.search_placeholder')}
          inputProps={{ 'aria-label': 'search' }}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setSearch(e.target.value)}
        />
        <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={onSearchClick}>
          <SearchIcon />
        </IconButton>
      </Paper>
      <Divider sx={{m: '5px 0 5px'}} />
      <Grid container rowSpacing={1} columnSpacing={2} sx={
        {
          maxHeight: '500px',
          overflow: 'auto',
        }
      }>
        
        {
          icons.map((icon: string, index: number)=>(
            <Grid item xs={2.4}>
              <DragContainer sx={gridItem} key={`iconify_${index}`} importCode={IconifyConfig.importCode} name={IconifyConfig.name} code={IconifyConfig.code} attributes={{...IconifyConfig.attributes, icon: `mdi:${icon}`}}>
                <Iconify icon={`mdi:${icon}`} width={24} />
              </DragContainer>
            </Grid>
          ))
        }
      </Grid>
    </>
}
