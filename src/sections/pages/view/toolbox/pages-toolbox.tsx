'use client'

import { useEffect, useState } from 'react';
import _ from 'lodash';
// @mui
import Box from '@mui/material/Box';
import IconButton from "@mui/material/IconButton";
import Tooltip from '@mui/material/Tooltip';
import { alpha, useTheme } from '@mui/material/styles';
// hooks
import { useLocales } from "src/locales";

// Icon
import WidgetsIcon from '@mui/icons-material/Widgets';
import MoodIcon from '@mui/icons-material/Mood';
import NumbersIcon from '@mui/icons-material/Numbers';
import FunctionsIcon from '@mui/icons-material/Functions';
import TranslateIcon from '@mui/icons-material/Translate';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { useSelector } from 'src/redux/store';

import { configList} from 'src/pluginapp-context-manager/ui-lib';
import { useParams } from 'src/routes/hook';
// hooks
import useToolbox from 'src/sections/pages/hooks/use-toolbox';

// config
import { W_ATTRIBUTE } from '../../config';
import ToolboxComponentsForm from './toolbox-components-form';
import ToolboxComTreeForm from './toolbox-com-tree-form';
import ToolboxIconsForm from './toolbox-icons-form';
import ToolboxCommonForm, { ToolboxCommonListItem } from './toolbox-common-form';
import VariablesModal from './variables-modal'
import FunctionModal from './functions-modal';


export default function PagesToolbox() {
  const _renderToolbox = () => (<>
    <Tooltip title={t('project_design.toolbox.components')} placement="left">
      <IconButton onClick={(event: React.MouseEvent<HTMLElement>)=>{setCurrentToolboxType('components')}}>
        <WidgetsIcon />
      </IconButton>
    </Tooltip>
    <Tooltip title={t('project_design.toolbox.icons')} placement="left">
      <IconButton onClick={(event: React.MouseEvent<HTMLElement>)=>{setCurrentToolboxType('icons')}}>
        <MoodIcon />
      </IconButton>
    </Tooltip>
    <Tooltip title={t('project_design.toolbox.variables')} placement="left">
      <IconButton onClick={(event: React.MouseEvent<HTMLElement>)=>{setCurrentToolboxType('variables')}}>
        <NumbersIcon/>
      </IconButton>
    </Tooltip>
    <Tooltip title={t('project_design.toolbox.functions')} placement="left">
      <IconButton onClick={(event: React.MouseEvent<HTMLElement>)=>{setCurrentToolboxType('functions')}}>
        <FunctionsIcon/>
      </IconButton>
    </Tooltip>
    <Tooltip title={t('project_design.toolbox.texts')} placement="left">
      <IconButton onClick={(event: React.MouseEvent<HTMLElement>)=>{setCurrentToolboxType('texts')}}>
        <TranslateIcon />
      </IconButton>
    </Tooltip>
    <Tooltip title={t('project_design.toolbox.component_tree')} placement="left">
      <IconButton onClick={(event: React.MouseEvent<HTMLElement>)=>{setCurrentToolboxType('tree')}}>
        <AccountTreeIcon />
      </IconButton>
    </Tooltip>
    <Tooltip title={t('project_design.toolbox.help')} placement="left">
      <IconButton onClick={(event: React.MouseEvent<HTMLElement>)=>{setCurrentToolboxType('help')}}>
        <HelpOutlineIcon />
      </IconButton>
    </Tooltip>
  </>);

  const _renderToolboxForm = () => {
    switch (currentToolboxType) {
      case 'tree':
        return <ToolboxComTreeForm title={t('project_design.toolbox.component_tree')} 
          list={comTreeStructure} expandedItems={getParentNodes(selectedComId)} selectedId={selectedComId}
          onItemClick={setSelectedComId}
          onClose={closeToolboxContent} 
        />;
      case 'components':
        return <ToolboxComponentsForm title={t('project_design.toolbox.components')} onClose={closeToolboxContent} />;
      case 'icons':
        return <ToolboxIconsForm title={t('project_design.toolbox.icons')} onClose={closeToolboxContent} />;
      case 'texts':
        return <ToolboxCommonForm title={t('project_design.toolbox.texts')} list={[]} onItemSelectEvent={()=>{}} onAdd={()=>{}} onClose={closeToolboxContent}/>
      default:
        return null;
    }
  }

  const { t } = useLocales();
  const theme = useTheme();
  const params = useParams();
  const projectID = Number(params.projectID);
  const [openVariableTable, setOpenVariableTable] = useState(false);
  const [openFunctionTable, setOpenFunctionTable] = useState(false);
  const [currentToolboxType, setCurrentToolboxType] = useState<string>('');
  const { variables, functions, comTreeStructure, setSelectedComId, getParentNodes, updateToolBoxComponents } = useToolbox();
  const selectedComId = useSelector((state) => state.projectAttributes.selectedComId);

  const closeToolboxContent = () => {
    setCurrentToolboxType('');
  }


  useEffect(()=>{
    // components
    const toolBoxComponents = _.keyBy(configList, 'name')
    updateToolBoxComponents(toolBoxComponents)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  useEffect(()=>{
    if (currentToolboxType) {
      if (currentToolboxType === 'variables') {
        setOpenVariableTable(true)
      }
      if (currentToolboxType === 'functions') {
        setOpenFunctionTable(true)
      }
    }
  }, [currentToolboxType])
  // useEffect(()=>{
  //   setVariablesList(_.map(variables, (value, key) => ({name: value.key})) || [])
  // }, [variables])
  // useEffect(()=>{
  //   setFunsList(_.map(functions, (value, key) => ({name: value.name})) || [])
  // }, [functions])
  
  return <Box sx={{
      // position: 'absolute',
      // top: 100,
      // right: W_ATTRIBUTE + 100,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[24],
      borderRadius: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start'
    }}>
      {_renderToolbox()}
      {
        currentToolboxType && <Box
        sx={{
          position: 'absolute',
          right: '45px',
          width: '240px',
          overflow: 'inherit',
          zIndex: 2000,
          backgroundColor: theme.palette.background.paper,
          borderRadius: '10px',
          boxShadow: theme.shadows[24],
          padding:"5px",
        }}
      >
        {_renderToolboxForm()}
      </Box>
      }
      <VariablesModal projectID={Number(projectID)} open={openVariableTable} setOpen={setOpenVariableTable}/>
      <FunctionModal projectID={Number(projectID)} open={openFunctionTable} setOpen={setOpenFunctionTable}/>
    </Box>
}
