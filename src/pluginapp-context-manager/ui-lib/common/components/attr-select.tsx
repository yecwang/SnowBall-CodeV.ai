import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import Iconify from "src/components/iconify";
import { useAttributeEditor } from "src/sections/pages/hooks";

type TProps = {
  initialValue?: string;
  onChange: ( obj: { [key: string]: any }) => void;
  attributeKey: string;
  options: { label?: string; value: string; icon?: string | React.ReactNode; }[];
}

export default function PropSelect({ initialValue, onChange, attributeKey, options }: TProps) {
  const { componentTranslation } = useAttributeEditor();

  return <Select
    size='small'
    value={initialValue}
    sx={{
      minWidth: '70%',
    }}
    onChange={(event: SelectChangeEvent) => onChange({ [attributeKey]: event.target.value })}
  >
    {options.map((option)=>(
      <MenuItem value={option.value}>
        {option.icon && <Iconify icon={`${option.icon}`} />}
        {option.label ? componentTranslation(option.label) : null}
      </MenuItem>
    ))}
  </Select>
}
