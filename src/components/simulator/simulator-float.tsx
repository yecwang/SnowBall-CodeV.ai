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
  onClose?: () => void;
  dragDisabled?: boolean;
  device?: Device;
  bespread?: boolean;
  viewPosition?: {
    top: number;
    left: number;
    right: number;
  }
} & BoxProps;

export default function Simulator({
  open,
  children,
  onClose,
  dragDisabled,
  sx,
  device = Device.iphone,
  bespread,
  viewPosition,
}: TProps) {

  const breakpointWidth = useWidth()
  const width = deviceSizes[device].width[breakpointWidth];
  const height = deviceSizes[device].height[breakpointWidth];
  const _renderContent = () => {
    if (bespread) {
      return <Box sx={sx}>{children}</Box>
    }

    const _calculatorPosition = () => {
      let pageViewWidth = '100%';
      let pageViewHeight = '100%';
      if (viewPosition) {
        pageViewWidth = `calc(100% - ${viewPosition.left + viewPosition.right}px)`
        pageViewHeight =`calc(100% - ${viewPosition.top}px)`
      }
      
      const top = `calc(calc(${pageViewHeight} / 2) - ${height / 2}px + ${viewPosition?.top || 0}px)`
      const left = `calc(calc(${pageViewWidth} / 2) - ${width / 2}px + ${viewPosition?.left || 0}px)`
      return { top, left };
    }
    const { top, left } = _calculatorPosition();
    
    return <Box
      sx={{
        position: 'fixed',
        top,
        left,
        ...sx,
      }}
    >
      <Iphone15Container sx={{
        width: `${width}px`,
        height: `${height}px`,
      }}>
        {children}
      </Iphone15Container>
    </Box>
  }


  if (!open) {
    return null;
  }
  if (dragDisabled) {
    return _renderContent()
  }

  return (
    <Draggable bounds='body'>
      { _renderContent() }
    </Draggable>
  );
}
