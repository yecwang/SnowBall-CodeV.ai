'use client'

// @mui
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

// Custom components
import Iconify from 'src/components/iconify';

import { IComTreeStructure } from 'src/types/project/project';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

export default function ToolboxComTreeForm({title, list, selectedId, expandedItems, onItemClick, onClose}: {
  title: string,
  list: IComTreeStructure[],
  selectedId: string, 
  expandedItems: string[],
  onItemClick: (event: React.MouseEvent, itemId: string) => void,
  onClose: ()=>void | undefined
}) {
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
    <Divider sx={{m: '5px 0 5px'}} />
    <Box sx={{
      overflow: 'auto',
      maxHeight: '400px',
    }}>
      <RichTreeView selectedItems={selectedId} defaultExpandedItems={expandedItems} items={list} onItemClick={onItemClick}/>
    </Box>
  </>
}
