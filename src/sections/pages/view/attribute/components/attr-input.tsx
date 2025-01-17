/* eslint-disable consistent-return */
import { InputAdornment, SxProps, TextField, Tooltip } from "@mui/material";
import { HTMLInputTypeAttribute } from "react";
import Iconify from "src/components/iconify";
import * as React from 'react';
import {
  Unstable_NumberInput as BaseNumberInput,
  NumberInputProps,
  numberInputClasses,
} from '@mui/base/Unstable_NumberInput';
import { styled } from '@mui/system';
import { useAttributeEditor } from "src/sections/pages/hooks";

type TProps = {
  unit?: string;
  label?: string;
  initialValue?: string;
  onChange: ( obj: { [key: string]: any }) => void;
  attributeKey: string;
  type?: HTMLInputTypeAttribute;
  icon?: string;
  sx?: SxProps
}
export default function AttrInput({ unit, label, initialValue, onChange, attributeKey, type, icon, sx }: TProps) {
  const _handleValue = (v: string | undefined) => {
    if (v === undefined || v === null || v === '') {
      return;
    }
    if (typeof v === 'number') {
      return v;
    }
    if (!unit) {
      return type === 'number' ? Number(v) : v;
    }

    const newV = v.split(unit)[0];
    return type === 'number' ? Number(newV) : newV;
  }
  // if (type === 'number') {
  //   return <Tooltip title={label} arrow><NumberInput
  //     value={_handleValue(initialValue) as number}
  //     onChange={(e, v) => onChange({ [attributeKey]: unit ? `${v}${unit}`: v })}
  //     // @ts-ignore
  //     sx={{
  //       height: '40px',
  //       '.base-NumberInput-input': sx
  //     }}
  //     startAdornment={
  //       icon ? <CusInputAdornment>
  //         <Iconify icon={icon}/>
  //       </CusInputAdornment> : null
  //     }
  //   /></Tooltip>
  // }

  const _initialValue = _handleValue(initialValue);
  const [value, setValue] = React.useState(_initialValue);
  const { currentComponentAttr } = useAttributeEditor();
  // console.log('value', value, typeof value, 'initialValue', initialValue, attributeKey);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    const newValue = _initialValue;
    // console.log('newValue', newValue, typeof newValue, `${currentComponentAttr?.elementID}_${attributeKey}`);
    setValue(newValue);
  }, [_initialValue])

  return (
    <Tooltip title={label} arrow>
      <TextField
        sx={{ 
          // minWidth: '70%',
          ...(sx || {})
        }}
        type={type}
        size='small'
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        InputProps={{
          startAdornment: icon ? <InputAdornment
            sx={{ fontSize: '12px', '.MuiTypography-root': { fontSize: 'unset' } }}
            position="start"
          >
            <Iconify icon={icon}/>
          </InputAdornment> : null,
        }}
        InputLabelProps={{
          shrink: true,
        }}
        multiline
        onBlur={() => onChange({ [attributeKey]: unit ? `${value}${unit}`: value })}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            onChange({ [attributeKey]: unit ? `${value}${unit}`: value });
          }
        }}
      />
    </Tooltip>
  );
}

const NumberInput = React.forwardRef((
  props: NumberInputProps & { sx?: SxProps },
  ref: React.ForwardedRef<HTMLDivElement>,
) => (
    <BaseNumberInput
      slots={{
        root: InputRoot,
        input: InputElement,
        incrementButton: Button,
        decrementButton: Button,
      }}
      sx={{ width: '100px', bg: 'red' }}
      slotProps={{
        incrementButton: {
          children: <span className="arrow">▴</span>,
        },
        decrementButton: {
          children: <span className="arrow">▾</span>,
        },
      }}
      {...props}
      ref={ref}
    />
  ));

const CusInputAdornment = styled('div')(
  ({ theme }) => `
  margin: 8px;
  margin-right: 0px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  grid-row: 1/3;
  color: ${theme.palette.mode === 'dark' ? grey[500] : grey[700]};
`,
);

const blue = {
  100: '#DAECFF',
  200: '#B6DAFF',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  700: '#0059B2',
  900: '#003A75',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const InputRoot = styled('div')(
  ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 400;
  border-radius: 8px;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  // background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  box-shadow: 0px 2px 4px ${
    theme.palette.mode === 'dark' ? 'rgba(0,0,0, 0.5)' : 'rgba(0,0,0, 0.05)'
  };
  display: grid;
  grid-template-columns: auto 1fr auto 19px;
  grid-template-rows: 1fr 1fr;
  overflow: hidden;
  // padding: 4px;

  &.${numberInputClasses.focused} {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[700] : blue[200]};
  }

  &:hover {
    border-color: ${blue[400]};
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`,
);

const InputElement = styled('input')(
  ({ theme }) => `
  font-size: 0.875rem;
  font-family: inherit;
  font-weight: 400;
  line-height: 1.5;
  grid-row: 1/3;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: inherit;
  border: none;
  border-radius: inherit;
  padding: 6px 10px;
  outline: 0;
`,
);

const Button = styled('button')(
  ({ theme }) => `
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  appearance: none;
  padding: 0;
  width: 19px;
  height: 20px;
  font-family: system-ui, sans-serif;
  font-size: 0.875rem;
  line-height: 1;
  box-sizing: border-box;
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 0;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 120ms;

  &:hover {
    background: ${theme.palette.mode === 'dark' ? grey[800] : grey[50]};
    border-color: ${theme.palette.mode === 'dark' ? grey[600] : grey[300]};
    cursor: pointer;
  }

  &.${numberInputClasses.incrementButton} {
    grid-column: 4/5;
    grid-row: 1/2;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    border: 1px solid;
    border-bottom: 0;
    border-color: ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
    color: ${theme.palette.mode === 'dark' ? grey[200] : grey[900]};

    &:hover {
      cursor: pointer;
      color: #FFF;
      background: ${theme.palette.mode === 'dark' ? blue[600] : blue[500]};
      border-color: ${theme.palette.mode === 'dark' ? blue[400] : blue[600]};
    }
  }

  &.${numberInputClasses.decrementButton} {
    grid-column: 4/5;
    grid-row: 2/3;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    border: 1px solid;
    border-color: ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
    color: ${theme.palette.mode === 'dark' ? grey[200] : grey[900]};

    &:hover {
      cursor: pointer;
      color: #FFF;
      background: ${theme.palette.mode === 'dark' ? blue[600] : blue[500]};
      border-color: ${theme.palette.mode === 'dark' ? blue[400] : blue[600]};
    }
  }

  & .arrow {
    transform: translateY(-1px);
  }

  & .arrow {
    transform: translateY(-1px);
  }
`,
);
