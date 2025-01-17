import { Stack, Typography } from "@mui/material";
import AttrInput from "./attr-input";
import AttrSelect from "./attr-select";
import AttrSwitch from "./attr-switch";
import { translate } from '../utils';
import { TLanguage, TLocales } from "../type";

type TProps = {
  attributes: {
    key: string;
    label: string;
    component: string;
    defaultValue?: string | boolean | number | null | undefined;
    values?: { label: string; value: string }[];
    type?: string;
  }[];
  componentAttribute: any;
  onChange: (value: any) => void;
  language: TLanguage;
  locales: TLocales;
}
export default function RenderAttr({ attributes, componentAttribute, onChange, language, locales }: TProps) {
  return <>
    {
      attributes.map((prop: any) => <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <Typography sx={{ fontSize: theme => theme.typography.body2 }}>{translate(prop.label, language, locales)}</Typography>
        { prop.component === 'TextField' ? <AttrInput type={prop.type} initialValue={componentAttribute[prop.key] || prop.defaultValue} attributeKey={prop.key} onChange={onChange} /> : null }
        { prop.component === 'Select' ? <AttrSelect initialValue={componentAttribute[prop.key] || prop.defaultValue} attributeKey={prop.key} options={prop.values} onChange={onChange} /> : null }
        { prop.component === 'Switch' ? <AttrSwitch
            initialValue={!!((componentAttribute[prop.key] || prop.defaultValue) === 'true' || (componentAttribute[prop.key] || prop.defaultValue) === true)}
            attributeKey={prop.key}
            onChange={onChange}
          /> : null }           
      </Stack>)
    }
  </>
}
