import Ruler from "@scena/react-ruler";
import { useRef } from "react";
// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

export default function PagesRuler() {
  const theme = useTheme();
  const isLightMode = theme.palette.mode === 'light';
  const backgroundColor = isLightMode ? '#CEDCEC' : undefined;

  return <Box sx={{ width: '100%', minHeight: 1 }}>
    <Ruler
      type="horizontal"
      direction="start"
      lineColor="rgba(154,190,222,1)"
      textColor="rgba(154,190,222,1)"
      backgroundColor={backgroundColor}
      style={{ height: '30px', width: '100%', position: 'absolute', top: 0 }}
    />
    <Ruler
      type="vertical"
      direction="start"
      lineColor="rgba(154,190,222,1)"
      textColor="rgba(154,190,222,1)"
      backgroundColor={backgroundColor}
      style={{ height: '100%', width: '30px', position: 'absolute', left: 0 }}
    />
  </Box>
}
