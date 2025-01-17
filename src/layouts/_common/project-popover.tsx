import { m } from 'framer-motion';
import { useState } from 'react';

// @mui
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
// locales
import { useLocales } from 'src/locales';
// components
import Iconify from 'src/components/iconify';
import { varHover } from 'src/components/animate';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
// 
// import ProjectNewEditForm from 'src/sections/project/project-create-form'
// import ProjectChoose from 'src/sections/project/project-choose'


// ----------------------------------------------------------------------

export default function ProjectPopover() {
  const {t} = useLocales();

  const [ createDialogOpen, setCreateDialogOpen ] = useState(false);
  const [ chooseDialogOpen, setChooseDialogOpen ] = useState(false);

  const popover = usePopover();
  const onProjectCreateFormClose = () => {
    setCreateDialogOpen(false)
  }
  const handleCreateProject = () => {
    popover.onClose();
    setCreateDialogOpen(true)
  }
  const onProjectChooseClose = () => {
    setChooseDialogOpen(false)
  }
  const handleLoadProject = () => {
    popover.onClose();
    setChooseDialogOpen(true)
  }

  return (
    <>
      <Button
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        onClick={popover.onOpen}
        startIcon={<Iconify sx={{ border: (theme) => `solid 2px ${theme.palette.background.default}`}} icon="ant-design:project-filled" />}
        sx={{
          height: 40,
          fontSize: 12,
          color: 'text.secondary'
        }}
      >
        { t('header.project.menu_title') }
      </Button>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 135, p: 0 }}>
        <MenuItem
          onClick={handleCreateProject}
          sx={{ m: 1, fontWeight: 'fontWeightBold', color: 'success.main' }}
        >
          { t('header.project.create') }
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          onClick={handleLoadProject}
          sx={{ m: 1, fontWeight: 'fontWeightBold', color: 'success.main' }}  
        >
          { t('header.project.open') }
        </MenuItem>
      </CustomPopover>
      {/* <ProjectNewEditForm open={createDialogOpen} onClose={onProjectCreateFormClose}/>
      <ProjectChoose open={chooseDialogOpen} onClose={onProjectChooseClose}/> */}
    </>
  );
}
