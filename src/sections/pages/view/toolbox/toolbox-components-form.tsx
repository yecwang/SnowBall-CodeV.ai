'use client'

import { useCallback, useEffect, useState } from 'react';
// @mui
import Box from '@mui/material/Box';
import IconButton from "@mui/material/IconButton";
import CloseIcon from '@mui/icons-material/Close';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Paper from "@mui/material/Paper";
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Grid from '@mui/material/Grid';
import DragContainer from 'src/sections/pages/components/drag-container';
import { alpha, useTheme } from '@mui/material/styles';

// Icon
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import FileCopyIcon from '@mui/icons-material/FileCopy';
// Custom components
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';

import {UILib, configList} from 'src/pluginapp-context-manager/ui-lib';
import { IComponent } from 'src/types/project/project';

// hooks
import { useLocales } from 'src/locales';
import useToolbox from '../../hooks/use-toolbox';
import { useAttributeEditor } from '../../hooks';


export default function ToolboxComponentsForm({title, onClose}: {title: string, onClose: ()=>void | undefined}) {

  const { componentTranslation } = useAttributeEditor();
  const { t } = useLocales();
  const theme = useTheme();
  const { components } = useToolbox();
  const [ comList, setComList] = useState<IComponent[]>([]);
  const [ comTypeList, setComTypeList] = useState<string[]>(['基础类', '表单类', '图表类']);
  const [search, setSearch] = useState<string>('');
  const typographyStyles = { fontSize: '12px', marginTop: '5px' };
  const gridItem = { 
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    padding: '5px',
    // paddingTop: '5px',
    // paddingBottom: '5px',
    background: alpha(theme.palette.grey[400], 0.16),
    '&:hover': {
      background: alpha(theme.palette.grey[400], 0.64),
    },
    cursor: 'pointer',
    borderRadius: '2px'
  };


  useEffect(()=>{
    if (components) {
      setComList(Object.values(components))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSearchEvent = useCallback(()=>{
    if (!search) {
      setComList(Object.values(components))
      return;
    }
    const searchList: IComponent[] = Object.values(components).filter((item: IComponent) => item.label.includes(search));
    setComList(searchList)
  }, [components, search])

  return <>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mx: 1,
        my: 1,
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
          inputProps={{ 'aria-label': 'com-search' }}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {setSearch(e.target.value)}}
        />
        <IconButton type="button" sx={{ p: '10px' }} aria-label="com-search" onClick={onSearchEvent} >
          <SearchIcon />
        </IconButton>
      </Paper>
      <Divider sx={{m: '5px 0 5px'}} />
      <Box sx={{
        overflow: 'auto',
        maxHeight: '400px',
      }}>
        {
          comTypeList.map((item: string, index: number)=>(
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Typography sx={{fontSize: '14px'}}>{item}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container rowSpacing={1} columnSpacing={1} sx={{ '& typography': {fontSize: '14px',
                fontWeight: 'normal'}}}>
                  {
                    comList.map((comItem: IComponent, index: number) => (
                        <Grid item xs={4}>
                          <DragContainer sx={gridItem} key={index} importCode={comItem.importCode} name={comItem.name} code={comItem.code} attributes={comItem.attributes}>
                            <Iconify icon={comItem.icon} width={35} height={35} />
                            <Typography sx={typographyStyles}>{componentTranslation(comItem.label, comItem.name)}</Typography>
                          </DragContainer>
                        </Grid>
                      ))
                  }
                </Grid>
              </AccordionDetails>
            </Accordion>))
        }
      </Box>
    </>
}
