import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import LaptopIcon from '@mui/icons-material/Laptop';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import TabletIcon from '@mui/icons-material/Tablet';
import { Box } from '@mui/material';
import { SxProps } from '@mui/material/styles';
import { Device } from './type';

type TProps = {
  sx?: SxProps
  device: Device,
  onDeviceChange: (device: Device) => void
}
export default function DeviceSwitch({ sx, device, onDeviceChange }: TProps) {
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: Device,
  ) => {
    if (newAlignment === null) return;
    onDeviceChange(newAlignment)
  };

  return (
    <Box
      sx={{
        ...(sx || {}),
      }}
    >
      <ToggleButtonGroup
        color="primary"
        value={device}
        exclusive
        onChange={handleChange}
        aria-label="Platform"
        size="small"
      >
        <ToggleButton size='small' value={Device.web}><LaptopIcon /></ToggleButton>
        <ToggleButton size='small' value={Device.iphone}><PhoneAndroidIcon /></ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}
