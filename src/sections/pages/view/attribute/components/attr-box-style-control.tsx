import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { Stack } from '@mui/system';
import Iconify from "src/components/iconify";

const Icon = ({ icon }: { icon: string | React.ReactNode }) => {
  if (typeof icon === 'string') {
    return <Iconify icon={icon}/>;
  }

  return icon;
}

type TProps = {
  options: { label: string; value: string; key: string, icon?: string }[] | [];
  onChange: (obj: any) => void;
};
export default function AttrBoxStyleControl({ options, onChange }: TProps) {
  // const isRelation
  return (
    <Stack direction="row" alignItems="center" spacing={0.2} sx={{ minWidth: '70%' }}>
      {
        options.map(option => (
          <TextField
            size="small"
            type="number"
            value={(option.value || '').replace('px', '')}
            key={option.key}
            sx={{ p: '5px 3px' }}
            onChange={(e) => {
              onChange({ [option.key]: e.target.value !== '' ? `${e.target.value}px` : undefined })
            }}
            InputProps={{
              startAdornment: <InputAdornment sx={{ fontSize: '12px', '.MuiTypography-root': { fontSize: 'unset' } }} position="start">{option.icon ? <Icon icon={option.icon} /> : option.label}</InputAdornment>,
            }}
          />
        ))
      }
      {/* <Iconify width="50px" icon="hugeicons:link-06" /> */}
    </Stack>
  );
};
