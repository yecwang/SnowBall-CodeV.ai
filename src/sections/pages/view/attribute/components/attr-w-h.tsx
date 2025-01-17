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

type TProps = {
  attributeKey: string;
  initialValue: string | undefined;
  onChange: (obj: any) => void;
  options: { label: string; value: string }[];
};
export default function WidthHeight({ initialValue, attributeKey, onChange, options } : TProps) {
  const _handleChangeFontSize = (v?: number) => {
    if (v !== undefined && v >= 0) {
      onChange({ [attributeKey]: `${v}${type}` });
    }
    if (v === undefined) {
      onChange({ [attributeKey]: 'unset' });
    }
    if (type === 'auto') {
      onChange({ [attributeKey]: 'auto' });
    }
  }
  const _handleAnchorElClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };
  const _handleAnchorElClose = (v?: string) => {
    setAnchorEl(null);
    if (!v) {
      return;
    }

    setType(v);
    if (v === 'auto') {
      onChange({ [attributeKey]: 'auto' });
      return;
    }
    if (value !== undefined) {
      onChange({ [attributeKey]: `${value}${v}` });
    }
  };
  const _formatInitialValue = () => {
    if (!initialValue) {
      return {
        value: undefined,
        type: options[0].value,
      };
    }

    const option = options.find(option => initialValue.indexOf(option.value) !== -1);
    if (option?.value === 'auto') {
      return {
        value: undefined,
        type: initialValue,
      };
    }

    if (option) {
      const [v] = initialValue.split(option.value);
      return {
        type: option.value,
        value: Number(v),
      };
    }

    return {
      value: undefined,
      type: options[0].value,
    };
  }

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const formatInitial = _formatInitialValue();
  const [value, setValue] = React.useState(formatInitial.value);
  const [type, setType] = React.useState(formatInitial.type || options[0].value);

  return (
    <Paper
      component="form"
      sx={{ display: 'flex', alignItems: 'center', border: theme => `1px solid ${theme.palette.divider}`, width: '110px', height: '28px', borderRadius: 'unset' }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1, '.MuiInputBase-input': { fontSize: '12px' } }}
        type="number"
        defaultValue={formatInitial.value}
        value={value}
        disabled={type === 'auto'}
        onChange={(event) => {
          setValue(event.target.value !== '' ? Number(event.target.value) : undefined)
        }}
        onBlur={() => _handleChangeFontSize(value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            _handleChangeFontSize(value);
          }
        }}
      />
      <Divider sx={{ height: 28 }} orientation="vertical" />
      <IconButton color="primary" onClick={_handleAnchorElClick} sx={{ width: '55px', borderRadius: 'unset', fontSize: '12px' }} aria-label="directions">
        {options.find(option => option.value === type)?.label || <ArrowDropDownIcon /> } 
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => _handleAnchorElClose()}
      >
        {
          options.map(({ value, label }, index) => (
            <MenuItem sx={{ mb: '0 !important', p: '3px 20px', fontSize: '12px' }} key={index} onClick={() => _handleAnchorElClose(value)}>{label}</MenuItem>
          ))
        }
      </Menu>
    </Paper>
  );
}
