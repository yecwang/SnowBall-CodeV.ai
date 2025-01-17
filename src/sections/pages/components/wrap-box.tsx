import React, { Dispatch, SetStateAction, useCallback, useRef, useState } from 'react';
import Box, {BoxProps} from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import { useLocales } from 'src/locales';
import Iconify from 'src/components/iconify/iconify';
import Popover, { PopoverPosition, PopoverProps } from '@mui/material/Popover';
import { useSelector, useDispatch } from 'src/redux/store';
import { updateSelectedComId, updateCurrentComponentAttribute, updateWillInsertLocationComs } from 'src/redux/slices/attribute-editor';
import { ComStructure, IAttribute } from 'src/types/project/project';
import { useDrag, useDrop } from 'react-dnd';
import { addComponentToCode, deleteFromCode, moveComponentInCode } from 'src/pluginapp-context-manager/utils/ast-util';
import { useSnackbar } from 'src/components/snackbar';
import { useRunner } from '../hooks';

export type EditModeAttr = {
  projectID: string;
  pageID: string;
  attributes: any;
  componentName: string;
  code: string;
  comStructure: ComStructure
}


const WrapBox: React.FC<{comAttr: EditModeAttr, root: boolean}&BoxProps> = ({children, sx, root, comAttr, ...other}) => {
  const theme = useTheme();
  const { t } = useLocales();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const selectedComId = useSelector((state) => state.projectAttributes.selectedComId);
  const willInsertLocationComs = useSelector((state) => state.projectAttributes.willInsertLocationComs);
  const {comStructure} = comAttr;
  const isContainer = comAttr.componentName === 'Container' || comAttr.componentName === 'Box' || comAttr.componentName === 'Card' || comAttr.componentName === 'Grid';
  const currentRealID: string = other.id?.replace('wrapbox_', '') || ''
  const isSelected = selectedComId === currentRealID;
  const border = isSelected ? `2px dashed ${theme.palette.warning.light}` : undefined;
  const hoverBorder = !isSelected ? `1px solid ${theme.palette.primary.main}`: undefined;
  const { projectID, pageID } = comAttr;
  const ref = useRef<HTMLDivElement>(null)
  const { changeCode, getPageCode } = useRunner({ projectID, pageID });
  const [anchorPosition, setAnchorPosition] = useState<PopoverPosition|undefined>(undefined);
  const open = Boolean(anchorPosition);
  
  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    selectedCom();
  };
  const selectedCom = useCallback(()=>{
    const componentAttr: IAttribute = {
      elementID: comAttr.attributes.id,
      componentName: comAttr.componentName,
      attributes: comAttr.attributes,
    };
    dispatch(updateCurrentComponentAttribute({ projectID: comAttr.projectID, componentAttr}))
    dispatch(updateSelectedComId(other.id?.replace('wrapbox_', '')||''));
  }, [comAttr.attributes, comAttr.componentName, comAttr.projectID, dispatch, other.id])

  
  const handleBoxClick = useCallback((event: React.TouchEvent) => {
    // 检查点击的目标是否是子组件
    if (event.target !== event.currentTarget) {
       if (isContainer) {
         // 子组件是Container 不向上传递
         event.stopPropagation();
        } else {
        // 子组件不是Container或Box，阻止事件向下传递
        event.preventDefault();
      }
      return;
    }
    event.stopPropagation();
    event.preventDefault();
    selectedCom();
  }, [isContainer, selectedCom]);
  
  const handleShowMenu = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    setAnchorPosition({top: event.clientY, left: event.clientX});
  }, [])
  const handleDelete = useCallback((event: React.MouseEvent) => {
    const pageCode = getPageCode();
    if (!pageCode) {
      return
    }
    const newCode: string = deleteFromCode(pageCode, comAttr.attributes.id)
    changeCode(projectID, pageID, newCode)
  }, [changeCode, comAttr.attributes.id, getPageCode, pageID, projectID])
  const findCom = useCallback((id: string) => {
    const parentId = comStructure[id]?.parent
    if (!parentId) {
      return null
    }
    const relatedComs: Array<string> = [];
    const index = comStructure[parentId]?.children?.indexOf(id) || 0
    if (index !== 0) {
      relatedComs.push(comStructure[parentId]?.children[index - 1])
    }
    relatedComs.push(id)

    return {
      parent: parentId,
      relatedComs,
      index
    }
  }, [comStructure])
  const getNearbyComs = useCallback((id: string) => {
    const parentId = comStructure[id]?.parent
    if (!parentId) {
      return {}
    }
    const index = comStructure[parentId]?.children?.indexOf(id) || 0
    const preComId = comStructure[parentId]?.children[index - 1]
    const nextComId = comStructure[parentId]?.children[index + 1]
    return {
      preComId,
      nextComId,
    }

  }, [comStructure])
  const handleMoveUp = useCallback((event: React.MouseEvent) => {
    const com = findCom(currentRealID)
    if (!com) {
      return
    }
    const pageCode = getPageCode();
    if (!pageCode) {
      return
    }
    const {preComId} = getNearbyComs(currentRealID)
    if (!preComId) {
      enqueueSnackbar(t('project.pages.components.already_top'), {variant: 'warning'});
      return
    }
    const newCode = moveComponentInCode(pageCode, currentRealID, preComId, false)
    changeCode(projectID, pageID, newCode)
  }, [changeCode, currentRealID, enqueueSnackbar, findCom, getNearbyComs, getPageCode, pageID, projectID, t])
  const handleMoveDown = useCallback((event: React.MouseEvent) => {
    const com = findCom(currentRealID)
    if (!com) {
      return
    }
    const pageCode = getPageCode();
    if (!pageCode) {
      return
    }
    const {nextComId} = getNearbyComs(currentRealID)
    if (!nextComId) {
      enqueueSnackbar(t('project.pages.components.already_bottom'), {variant: 'warning'});
      return
    }
    const newCode = moveComponentInCode(pageCode, nextComId, currentRealID, false)
    changeCode(projectID, pageID, newCode)
  }, [changeCode, currentRealID, enqueueSnackbar, findCom, getNearbyComs, getPageCode, pageID, projectID, t]);


  const [{ isDragging }, drag] = useDrag({
    type: 'component',
    item: {
      id: currentRealID,
      new: false,
      name: comAttr.componentName,
      code: comAttr.code,
      attributes: comAttr.attributes
    },
    collect: (monitor: { isDragging: () => any; }) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      dispatch(updateWillInsertLocationComs([]));
    }
  });

  const [{ isOverCurrent }, drop] = useDrop(() => ({
    accept: 'component',
    drop: (item: any, monitor: any) => {
      if (monitor.didDrop()) {
        return
      }
      const pageCode = getPageCode();
      if (!pageCode) {
        return
      }
      let newCode = pageCode;
      console.log('newCode', newCode)
      if (item.new) {
        newCode = addComponentToCode(pageCode, currentRealID, item, isContainer)
      } else {
        newCode = moveComponentInCode(pageCode, item.id, currentRealID, isContainer)
      }
      changeCode(projectID, pageID, newCode)
    },
    collect: (monitor: any) => ({
      isOver: monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true }),
    }),
    hover({ id: draggedId }) {
      if (draggedId !== currentRealID) {
        const com = findCom(currentRealID)
        if(!com) {
          return
        }
        dispatch(updateWillInsertLocationComs(com.relatedComs));
      }
    },
  }));

  const getBoxShadow = () => {
    const BoxShadow = {
      top: '0px -5px 5px red',
      bottom: '0px 5px 5px red',
      left: '-5px 0px 5px red',
      right: '5px 0px 5px red',
    }
    const index = willInsertLocationComs.indexOf(currentRealID)
    if (index === -1) {
      return undefined;
    }
    const direction = comStructure[currentRealID].parentDirection
    if (willInsertLocationComs.length === 1 || index !== 0) {
      // 如果只有一个关联元素，或者是第二个元素的情况下，当前组件为被替换的位置
      switch (direction) {
        case 'row':
          return BoxShadow.left
        case 'row-reverse':
          return BoxShadow.right
        case 'column':
          return BoxShadow.top
        case 'column-reverse':
          return BoxShadow.bottom
        default:
          return BoxShadow.top
      }
    } else {
      switch (direction) {
        case 'row':
          return BoxShadow.right
        case 'row-reverse':
          return BoxShadow.left
        case 'column':
          return BoxShadow.bottom
        case 'column-reverse':
          return BoxShadow.top
        default:
            return BoxShadow.bottom
      }
    }
  }

  const boxShadow = getBoxShadow();
  let backgroundColor;
  if (isOverCurrent) {
    backgroundColor = 'lightblue'
  }
  const opacity = isDragging ? 0.2 : 1;
  drag(drop(ref))

  return <>
    {
      (isContainer ?
        (<Box
        ref={ref}
        component="div"
        onClick={handleBoxClick}
        onContextMenu={handleContextMenu}
        sx={{
          ...sx,
          position: "relative",
          border,
          boxSizing: 'border-box',
          cursor: 'pointer',
          backgroundColor,
          opacity,
          boxShadow,
          '&:hover': {
            outline: hoverBorder
          }
        }}
        {...other}>
          {(isSelected && !root) && <Menu showMenu={handleShowMenu} />}
          {children}
          <MenuPopover 
            open={open}
            anchorPosition={anchorPosition}
            setAnchorPosition={setAnchorPosition}
            handleDelete={handleDelete} 
            handleMoveUp={handleMoveUp}
            handleMoveDown={handleMoveDown}
          />
        </Box>) 
        : 
        (<Box
          ref={ref}
          component="div"
          sx={{
            position: "relative",
            ...sx, 
            opacity,
            boxShadow,
            '&:hover': {
              outline: hoverBorder
            },
          }}
          {...other}
          onClick={handleBoxClick}
          onContextMenu={handleContextMenu}
        > 
        {border && <Menu showMenu={handleShowMenu} />}  
          <Box 
            sx={{
              ...sx,
              border,
              pointerEvents: 'none',
            }}
          >
            {children}
          </Box>
          <MenuPopover 
            open={open}
            anchorPosition={anchorPosition}
            setAnchorPosition={setAnchorPosition}
            handleDelete={handleDelete} 
            handleMoveUp={handleMoveUp}
            handleMoveDown={handleMoveDown}
          />
        </Box>
      ))
    }
  </>
}

const Menu: React.FC<{
  showMenu: (event: React.MouseEvent) => void
}> = ({showMenu}) => <Iconify
    icon="iconamoon:menu-kebab-horizontal-square-duotone"
    width={30}
    color='warning.light'
    onClick={showMenu}
    sx={{
      position: 'absolute',
      top: -30,
      right: 0,
    }}
   />

const MenuPopover: React.FC<{
  setAnchorPosition: Dispatch<SetStateAction<PopoverPosition | undefined>>
  handleDelete: (event: React.MouseEvent) => void
  handleMoveUp: (event: React.MouseEvent) => void
  handleMoveDown: (event: React.MouseEvent) => void
}&PopoverProps> = (
  {
    open, anchorPosition, setAnchorPosition,
    handleDelete, handleMoveUp, handleMoveDown,
    ...props
  }
) => {
  const { t } = useLocales();
  const LIST = [
    { icon: 'material-symbols-light:move-up-rounded', label: t('project.pages.components.move_up'), onClick: handleMoveUp},
    { icon: 'material-symbols-light:move-down-rounded', label: t('project.pages.components.move_down'), onClick: handleMoveDown},
    { icon: 'material-symbols-light:delete-outline', label: t('common.delete'), onClick: handleDelete},
    { icon: 'ph:copy-light', label: t('common.copy'), onClick: () => {}},
  ] 
  const handleClose = () => {
    setAnchorPosition(undefined);
  };

  return <Popover
    open={open}
    anchorReference='anchorPosition'
    anchorPosition={anchorPosition}
    onClose={handleClose}
    onContextMenu={(event) => {
      setAnchorPosition(undefined);
      event.preventDefault();
    }}
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'left',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'left',
    }}
    {...props}
  >
      {
        LIST.map((item, index) => (<MenuItem key={index} sx={{minWidth: '100px', padding: 1, lineHeight: 1}} onClick={item.onClick}>
              <Iconify icon={item.icon} width={18} />
              <ListItemText secondary={item.label} sx={{ 
                marginLeft: '5px',
              }}/>
            </MenuItem>))
      }
  </Popover>
}



export default WrapBox;