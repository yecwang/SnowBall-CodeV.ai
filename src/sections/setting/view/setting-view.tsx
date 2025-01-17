'use client';

import { useState } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
// components
import { useSettingsContext } from 'src/components/settings';
// ----------------------------------------------------------------------

export default function SettingView() {
  const settings = useSettingsContext();
  const [open, setOpen] = useState(false);

  return (
    <Container className='setting-container' maxWidth={settings.themeStretch ? false : 'xl'}>
      <Button onClick={() => setOpen(!open)}>Open Simulator</Button>
      <Box
        sx={{
          mt: 5,
          width: 1,
          height: 320,
          borderRadius: 2,
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
          border: (theme) => `dashed 1px ${theme.palette.divider}`,
        }}
      />
    </Container>
  );
}
