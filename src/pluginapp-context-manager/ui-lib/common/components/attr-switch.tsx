import { Switch } from "@mui/material";

type TProps = {
  initialValue: boolean;
  onChange: ( obj: { [key: string]: any }) => void;
  attributeKey: string;
}

export default function PropSwitch({ initialValue, onChange, attributeKey }: TProps) {
  return <Switch
    checked={initialValue}
    onChange={event => onChange({ [attributeKey]: event.target.checked })}
    inputProps={{ 'aria-label': 'controlled' }}
  />
}
