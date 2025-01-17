import { m } from 'framer-motion';
import { useState } from 'react';
import { useSession, signOut, SessionContextValue } from 'next-auth/react';
import { User } from '@prisma/client';
import { Session } from 'next-auth';

// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// locales
import { useLocales } from 'src/locales';
// routes
import { useRouter } from 'src/routes/hook';
// components
import Iconify from 'src/components/iconify';
import { varHover } from 'src/components/animate';
import { useSnackbar } from 'src/components/snackbar';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
// routes
import { paths } from 'src/routes/paths';
// 
// import ProjectNewEditForm from 'src/sections/project/project-create-form'
// import ProjectChoose from 'src/sections/project/project-choose'


// ----------------------------------------------------------------------

export default function ProjectPopover() {
  const router = useRouter();
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
    // router.push(paths.dashboard.project.new);
  }
  const onProjectChooseClose = () => {
    setChooseDialogOpen(false)
  }
  const handleLoadProject = () => {
    popover.onClose();
    setChooseDialogOpen(true)
    // router.push(paths.dashboard.project.choose);
  }

  return (
    <>
      <Button
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        onClick={popover.onOpen}
        startIcon={<Iconify sx={{ border: (theme) => `solid 2px ${theme.palette.background.default}`}} icon="heroicons-solid:template" />}
        sx={{
          height: 40,
          fontSize: 12,
          color: 'text.secondary'
        }}
      >
        { t('header.template.menu_title') }
      </Button>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 135, p: 0 }}>
        <MenuItem
          onClick={handleCreateProject}
          sx={{ m: 1, fontWeight: 'fontWeightBold', color: 'success.main' }}
        >
          { t('header.template.create') }
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          onClick={handleLoadProject}
          sx={{ m: 1, fontWeight: 'fontWeightBold', color: 'success.main' }}  
        >
          { t('header.template.open') }
        </MenuItem>
      </CustomPopover>
    </>
  );
}
