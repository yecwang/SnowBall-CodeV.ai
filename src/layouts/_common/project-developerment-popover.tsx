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
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
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


// ----------------------------------------------------------------------

export default function ProjectPopover() {
  const router = useRouter();
  const {t} = useLocales();

  const popover = usePopover();
  const handlePublish = () => {
    popover.onClose();
  }
  const handleRun = () => {
    popover.onClose();
  }

  return (
    <>
      <Button
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        onClick={popover.onOpen}
        startIcon={<Iconify sx={{ border: (theme) => `solid 2px ${theme.palette.background.default}`}} icon="material-symbols:developer-board" />}
        sx={{
          height: 40,
          fontSize: 12,
          color: 'text.secondary'
        }}
      >
        { t('header.developerment.menu_title') }
      </Button>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 85, p: 0 }}>
        <MenuItem
          onClick={handleRun}
          sx={{ m: 1, fontWeight: 'fontWeightBold', color: 'success.main' }}
        >
          { t('header.developerment.run') }
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          onClick={handlePublish}
          sx={{ m: 1, fontWeight: 'fontWeightBold', color: 'success.main' }}  
        >
          { t('header.developerment.publish') }
        </MenuItem>
      </CustomPopover>
    </>
  );
}
