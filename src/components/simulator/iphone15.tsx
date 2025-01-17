import React from 'react';
import { Box } from '@mui/material';
import { BoxProps, styled } from '@mui/system';
import Iconify from '../iconify/iconify';

const TOP_BAR_HEIGHT = 45;

const IphoneContainer = styled(Box)(({ theme }) => ({
  width: '375px',
  height: '812px',
  border: `16px solid ${theme.palette.primary.main}`,
  borderRadius: '36px',
  boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
  position: 'relative',
  backgroundColor: theme.palette.background.default,
  overflow: 'hidden', // Ensure children are clipped to the container's border
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '10px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '90px',
    height: '5px',
    backgroundColor: theme.palette.mode === 'light' ? 'black' : 'white',
    borderRadius: '10px',
  },
}));

const TopBar = styled(Box)(({ theme }) => ({
  width: '100%',
  height: `${TOP_BAR_HEIGHT}px`,
  backgroundColor: theme.palette.background.default,
  borderBottom: theme.palette.text.primary,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 10px',
  boxSizing: 'border-box',
  position: 'sticky',
  top: 0,
}));

const DynamicIsland = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '5px',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '126px', // Adjust the width according to your needs
  height: '30px', // Adjust the height according to your needs
  backgroundColor: 'black',
  borderRadius: '20px', // Make the edges rounded
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white', // Text color inside the dynamic island
  fontSize: '14px', // Font size for the text inside
}));

const TimeDisplay = styled(Box)(({ theme }) => ({
  fontSize: '14px',
  color: theme.palette.text.primary,
}));

const StatusIcons = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  color: theme.palette.text.primary,
}));

const Iphone15Container = ({ children, sx }: BoxProps) => (
  <IphoneContainer sx={{...sx}}>
    <TopBar>
      <TimeDisplay>10:00</TimeDisplay>
      <DynamicIsland/>
      <StatusIcons>
        <Iconify icon="ic:round-wifi"/>
        <Iconify icon="ion:battery-full" width='27px' height='13px'/>
      </StatusIcons>
    </TopBar>
    <Box sx={{ width: '100%',  height: `calc(100% - ${TOP_BAR_HEIGHT}px)`}}>
      {children}
    </Box>
  </IphoneContainer>
);

export default Iphone15Container;