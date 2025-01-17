import React from 'react';
import Box, { BoxProps } from '@mui/material/Box';
// eslint-disable-next-line import/no-extraneous-dependencies
import Draggable from 'react-draggable';
import { useResponsive, useWidth } from 'src/hooks/use-responsive';
import './simulator.css';
import Iphone15Container from './iphone15'
import { Device } from './type';


type TDeviceSize = {
  [key in Device]: {
    width: { [key: string]: number },
    height: { [key: string]: number }
  }
};
const deviceSizes: TDeviceSize = {
  [Device.iphone]: {
    width: {
      sm: 375,
      md: 375,
      lg: 330,
      xl: 375,
    },
    height: {
      sm: 400,
      md: 812,
      lg: 550,
      xl: 812,
    },
  },
  [Device.ipad]: {
    width: {
      sm: 768,
      md: 768,
      lg: 500,
      xl: 768,
    },
    height: {
      sm: 1024,
      md: 1024,
      lg: 450,
      xl: 1024,
    }
  },
  [Device.web]: {
    width: {
      sm: 1366,
      md: 1366,
      lg: 700,
      xl: 1366,
    },
    height: {
      sm: 768,
      md: 768,
      lg: 450,
      xl: 768,
    }
  },
};

type TProps = {
  open: boolean;
  bespread?: boolean;
} & BoxProps;

export default function Simulator({
  open,
  children,
  sx,
  bespread,
}: TProps) {
  const _renderContent = () => {
    if (bespread) {
      return <Box sx={{
        width: 1,
        height: 1,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'auto',
        ...sx
      }}>
        {children}
      </Box>
    }

    const width = 375;
    const height = 812;
    return <Iphone15Container sx={{
      width: `${width}px`,
      height: `${height}px`,
      minWidth: `${width}px`,
      minHeight: `${height}px`,
    }}>
      {children}
    </Iphone15Container>
  }

  if (!open) {
    return null;
  }

  return <>
    { _renderContent() }
  </>
}
