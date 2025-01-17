import { useEffect, useState } from 'react';
import { SketchPicker, ColorResult } from 'react-color';
import type { Color } from 'react-color';
// @mui
import Box, { BoxProps } from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';

type TProps = {
  initialValue?: string;
  onChange: (obj: any) => void
  colorWidth?: number;
  colorHeight?: number;
  attributeKey: string;
}&BoxProps;
export default function AttrColor({ initialValue, onChange, attributeKey, colorWidth, colorHeight, sx }: TProps) {
  const _handleChangeComplete = (color: ColorResult) => {
    setColor(color.rgb);
    setBackground(color.hex);
    onChange({ [attributeKey]: color ? color.hex : initialValue });
  };
  const _handleAnchorElClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };
  const _handleAnchorElClose = (size?: number) => {
    setAnchorEl(null);
  };

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [background, setBackground] = useState<string|undefined>(initialValue);
  const [color, setColor] = useState<Color|undefined>(initialValue);

  useEffect(() => {
    setBackground(initialValue);
    setColor(initialValue);
  }, [initialValue]);

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return <>
  <Box
    component="button"
    onClick={_handleAnchorElClick}
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: (theme) => `1px solid ${theme.palette.divider}`,
      backgroundColor: 'transparent',
      padding: '5px',
      cursor: 'pointer',
      ...sx,
    }}
    >
      {
        background ? <Box
          sx={{
            width: `${colorWidth || 20}px`,
            height: `${colorHeight || 20}px`,
            backgroundColor: background,
          }}
        /> : <FormatColorFillIcon sx={{ fontSize: '20px', color: background }} />
      }
      {background ? <Typography variant="caption" sx={{ padding: '1px', pl: '8px' }}>{background}</Typography> : null }
    </Box>
    
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={() => _handleAnchorElClose()}
      anchorOrigin={{
        vertical: 'center',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'center',
        horizontal: 'right',
      }}
    >
      <SketchPicker
        color={ color }
        onChangeComplete={color => _handleChangeComplete(color)}
      />
    </Popover>
  </>
}
