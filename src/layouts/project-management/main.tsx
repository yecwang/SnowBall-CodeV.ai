// @mui
import Box, { BoxProps } from '@mui/material/Box';
//
import { HEADER } from '../config-layout';

export default function Main({ children, sx, ...other }: BoxProps) {
  return <Box
    component="main"
    sx={{
      height: 1,
      pt: `${HEADER.H_DESKTOP}px`,
      ...sx,
    }}
    {...other}
  >
    {children}
  </Box>
}