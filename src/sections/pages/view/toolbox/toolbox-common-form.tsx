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
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItem from "@mui/material/ListItem";

// Icon
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import Iconify from 'src/components/iconify/iconify';
// hooks
import { useLocales } from 'src/locales';

export type ToolboxCommonListItem = {
  name: string,
}

export type ToolboxCommonFormProps = {
  title: string,
  list: Array<ToolboxCommonListItem>,
  onItemSelectEvent: (index: number)=>void | undefined,
  onAdd: ()=>void | undefined,
  onClose: ()=>void | undefined,
}

export default function ToolboxCommonForm({
  title,
  list,
  onItemSelectEvent = (index: number)=>{},
  onAdd=()=>{},
  onClose=()=>{}
} : ToolboxCommonFormProps) {

  const { t } = useLocales();
  const [selectedPageIndex, setSelectedPageIndex] = useState(0);
  const [searchText, setSearchText] = useState('')
  const [dataList, setDataList] = useState(list)

  const onItemSelected = useCallback((index: number) => {
    if (selectedPageIndex !== index) {
      onItemSelectEvent(index);
      setSelectedPageIndex(index);
    }
  }, [onItemSelectEvent, setSelectedPageIndex, selectedPageIndex])


  useEffect(()=>{
    if (searchText) {
      setDataList(list.filter(item=> item?.name && item?.name?.includes(searchText)))
    }
  }, [list, searchText])

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
          <Iconify
            onClick={onAdd}
            icon='material-symbols-light:add'
            width={20}
          />
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
          inputProps={{ 'aria-label': 'search google maps' }}
          onChange={(e)=>setSearchText(e.target.value)}
        />
        <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Paper>
      <Divider sx={{m: '5px 0 5px'}} />
      <List component="nav" aria-label="main mailbox folders" sx={{height: 280, overflow: 'auto',}}>
        {
          dataList.map((item: ToolboxCommonListItem, index: number)=>(<>
            <ListItem selected={selectedPageIndex === index} onClick={()=>onItemSelected(index)}>
              <ListItemText key={`list_item_${index}`} primary={item.name} sx={{fontSize: 12}}/>
              <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', '& button': { padding: '2px'}}}>
                <Iconify icon='ph:copy-fill' onClick={(e)=>{e.stopPropagation(); console.log(`copy ${item}`)}} width={20} sx={{color: '#3BA5A6', marginRight: '5px'}} />
                <Iconify icon='ep:remove-filled' onClick={(e)=>{e.stopPropagation(); console.log(`remove ${item}`)}} width={20} sx={{ color: '#275B93'}} />
              </Box>
            </ListItem>
            <Divider sx={{m: '5px 0 5px'}} />
          </>))
        }
      </List>
    </>
}
