import * as React from 'react';
import { CSSObject } from '@emotion/react';
// @mui
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

const FONT_SIZES = [12, 13, 14, 16, 18, 20, 26, 38, 50];

type TProps = {
  initialSize: CSSObject['fontSize'];
  onChange: (obj: any) => void
};
export default function FontSize({ initialSize, onChange} : TProps) {
  const _handleChangeFontSize = (size?: number) => {
    if (size !== undefined && size >= 0) {
      onChange({ fontSize: `${size}px` });
    }
  }
  const _handleAnchorElClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };
  const _handleAnchorElClose = (size?: number) => {
    setAnchorEl(null);
    if (size) {
      setFontSize(size);
      _handleChangeFontSize(size);
    }
  };
  const _formatInitialSize = () => {
    if (typeof initialSize === 'string') {
      return Number(initialSize.replace('px', ''));
    }

    return initialSize as number;
  }

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const formatInitialSize = _formatInitialSize();
  const [fontSize, setFontSize] = React.useState(formatInitialSize);

  return (
    <Paper
      component="form"
      sx={{ display: 'flex', alignItems: 'center', border: theme => `1px solid ${theme.palette.divider}`, width: '70px', height: '28px', borderRadius: 'unset' }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1, '.MuiInputBase-input': { fontSize: '12px' } }}
        type="number"
        defaultValue={formatInitialSize}
        value={fontSize}
        onChange={(event) => setFontSize(Number(event.target.value))}
        onBlur={() => _handleChangeFontSize(fontSize)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            _handleChangeFontSize(fontSize);
          }
        }}
      />
      <Divider sx={{ height: 28 }} orientation="vertical" />
      <IconButton color="primary" onClick={_handleAnchorElClick} sx={{ width: '30px', borderRadius: 'unset' }} aria-label="directions">
        <ArrowDropDownIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => _handleAnchorElClose()}
      >
        {
          FONT_SIZES.map((size, index) => (
            <MenuItem sx={{ mb: '0 !important', p: '3px 20px', fontSize: '12px' }} key={index} onClick={() => _handleAnchorElClose(size)}>{size}</MenuItem>
          ))
        }
      </Menu>
    </Paper>
  );
}
