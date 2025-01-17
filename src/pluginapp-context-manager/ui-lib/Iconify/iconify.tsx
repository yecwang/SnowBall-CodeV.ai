import { forwardRef } from 'react';
// icons
import { Icon } from '@iconify/react';
// @mui
import Box, { BoxProps } from '@mui/material/Box';
//
import { IconifyProps } from './types';

// ----------------------------------------------------------------------

interface Props extends BoxProps {
  icon: IconifyProps;
}

const clickStyled = {
  cursor: 'pointer',
  transition: '+transform 0.3s ease-in-out',
  '&:active': {
    transform: 'scale(0.8)',
  },
}

const Iconify = forwardRef<SVGElement, Props>(({ icon, width = 20, sx, ...other }, ref) => (
  <Box
    ref={ref}
    component={Icon}
    className="component-iconify"
    icon={icon}
    sx={{ 
      width, 
      height: width,
      ...(other.onClick && clickStyled),
      ...sx
    }}
    {...other}
  />
));

export default Iconify;
