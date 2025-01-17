import * as React from 'react';
import TextField from '@mui/material/TextField';

type TProps = {
  text: string;
  onTextChange: (obj: any) => void
};

export default function MultilineTextFields({ text, onTextChange }: TProps) {
  const [value, setValue] = React.useState(text);

  return (
    <TextField
      id="outlined-multiline-flexible"
      label="Value"
      multiline
      size="small"
      value={value}
      sx={{ width: '100%' }}
      onChange={(e) => {
        setValue(e.target.value);
        console.log(e.target.value)
      }}
      onBlur={() => onTextChange(value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            onTextChange(value);
          }
        }}
      maxRows={4}
    />
  );
}