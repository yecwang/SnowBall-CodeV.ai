import * as React from 'react';
// @mui
import MuiToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Iconify from "src/components/iconify";

type TProps = {
  initialValue?: string | string[];
  isMultiple?: boolean;
  onChange: (obj: any) => void;
  options: { label?: string; value: string; icon?: string | React.ReactNode; }[];
  attributeKey: string;
};
export default function ToggleButton({ initialValue, isMultiple = false, onChange, options, attributeKey }: TProps) {
  const [value, setValue] = React.useState(initialValue);
  const Icon = ({ icon }: { icon: string | React.ReactNode }) => {
    if (typeof icon === 'string') {
      return <Iconify icon={icon}/>;
    }

    return icon;
  }

  return (
    <ToggleButtonGroup
      value={value || initialValue}
      exclusive={!isMultiple}
      onChange={(e, newValue) => {
        setValue(newValue);
        onChange({ [attributeKey]: newValue });
      }}
      aria-label="text formatting"
      sx={{
        '.MuiToggleButton-root': {
          p: '5px',
          m: 0,
          '.MuiSvgIcon-root': {
            fontSize: '16px',
          }
        }
      }}
    >
      {
        options.map((option, index) => (
          <MuiToggleButton key={index} value={option.value} aria-label={option.label}>
            {option.icon ? <Icon icon={option.icon} /> : option.label}
          </MuiToggleButton>
        ))
      }
    </ToggleButtonGroup>
  );
}
