import { Stack } from "@mui/material";
import { useAttributeEditor } from "src/sections/pages/hooks";
import { useLocales } from "src/locales";
import { AttrBoxStyleControl, AttrColor, AttrDisplayLabel } from "../components";

export default function ExteriorShadow({ attributeKey, onChange }: { attributeKey: string, onChange: (obj: any) => void}) {
  const _onShadow = (obj: any, attributeKey: string) => {
    for (const key in obj) {
      if (obj[key] === undefined && key !== 'shadowColor') {
        obj[key] = '0';
      }
    }
    const { shadowX, shadowY, shadowDim, shadowColor } = obj;
    const shadowValueStr = sxAttrs[attributeKey];
    let x; let y; let dim; let color;
    if (shadowValueStr) {
      [x, y, dim, color] = shadowValueStr.split(' ');
    }
    const shadow = `${shadowX ?? x ?? 0} ${shadowY ?? y ?? 0} ${shadowDim ?? dim ?? 0} ${shadowColor ?? color ?? ''}`;
    onChange({ [attributeKey]: shadow });
  }
  const _buildShadowValue = (attributeKey: string) => {
    const shadowValueStr = sxAttrs[attributeKey];
    if (shadowValueStr) {
      const [x, y, dim, color] = shadowValueStr.split(' ');
      const result: { [k: string]: string } = { shadowX: x, shadowY: y, shadowDim: dim, shadowColor: color };
      for (const key in result) {
        if (result[key] === '0') {
          result[key] = '';
        }
      }
      return result;
    }
    return { shadowX: '', shadowY: '', shadowDim: '', shadowColor: '' };
  }
  
  const { t } = useLocales()
  const { currentComponentAttr } = useAttributeEditor();
  const attrs = currentComponentAttr?.attributes || {}
  const sxAttrs = attrs?.sx || {}
  const shadowValue = _buildShadowValue(attributeKey);
  const AttrMap = {
    textShadow: {
      label: t('pages.attribute.shadow'),
      component: 'attr-box-style-control',
      options: [
        { label: 'X', value: shadowValue.shadowX, key: 'shadowX' },
        { label: 'Y', value: shadowValue.shadowY, key: 'shadowY' },
        { label: t('pages.attribute.dim'), value: shadowValue.shadowDim, key: 'shadowDim' },
      ]
    },
  }

  return <Stack direction="column" alignItems="flex-start" justifyContent="space-between" spacing={2}>
    <AttrDisplayLabel label={AttrMap.textShadow.label} />
    <Stack direction="row" alignItems="center" spacing={0.2}>
      <AttrBoxStyleControl options={AttrMap.textShadow.options} onChange={(obj: any) => _onShadow(obj, attributeKey)} />
      <AttrColor attributeKey="shadowColor" initialValue={shadowValue.shadowColor} onChange={(obj: any) => _onShadow(obj, attributeKey)} />
    </Stack>
  </Stack>
}