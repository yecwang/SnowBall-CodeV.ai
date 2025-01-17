import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { Stack, Typography } from '@mui/material';

type TProps = {
  initialValue?: number;
  onChange: ( obj: { [key: string]: any }) => void;
  attributeKey: string;
}
export default function PercentSlider({ initialValue, onChange, attributeKey }: TProps) {
  const v = (initialValue || 1) * 100;
  return (
    <Stack direction="row" minWidth="70%" alignContent="center" justifyContent="space-between" spacing={2}>
      <Slider
        min={0}
        max={100}
        value={v}
        aria-label="Default"
        valueLabelDisplay="auto"
        onChange={(e, newValue: number | number[]) => onChange({ [attributeKey]: (newValue as number) / 100 })}
      />
      <Typography sx={{ fontSize: theme => theme.typography.body2 }} id="non-linear-slider">
        {v}%
      </Typography>
    </Stack>
  );
}
