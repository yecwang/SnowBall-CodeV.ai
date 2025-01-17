import { Stack, Typography } from "@mui/material";
import { useLocales } from "src/locales";
import { useAttributeEditor } from "../../../hooks";
import { AttrDisplayLabel, AttrToggleButton, AttrSelect } from '../components';

type TProps = {
  onChange: (obj: any) => void
}
export default function ExteriorLayout({ onChange }: TProps) {
  const _getJustifyContentIcon = (flexDirection: string, value: string)=>{
    const justify = flexDirection && flexDirection.startsWith('row') ? '-justify' : ''
    // const reverse = flexDirection.endsWith('reverse') ? true : false
    return `material-symbols:align${justify}-${value}`
  }
  const _getAlignItemsIcon = (flexDirection: string, value: string)=>{
    const align = flexDirection && flexDirection.startsWith('row') ? '' : '-justify'
    if (value === 'baseline') {
      return align ? 'uil:horizontal-align-left' : 'uil:vertical-align-bottom'
    }
    return `material-symbols:align${align}-${value}`
  }

  const { currentComponentAttr } = useAttributeEditor();
  const attrs = currentComponentAttr?.attributes || {}
  const sxAttrs = attrs?.sx || {}
  const { t } = useLocales()

  const AttrMap = {
    flexDirection: {
      label: t('pages.attribute.flex_direction'),
      type: 'toggle-button',
      defaultValue: 'row',
      values: [
        {label: '', value:'row', icon: 'mdi:arrow-right-bold'},
        {label: '', value:'row-reverse', icon: 'mdi:arrow-left-bold'},
        {label: '', value:'column', icon: 'mdi:arrow-down-bold'},
        {label: '', value:'column-reverse', icon: 'mdi:arrow-up-bold'},
      ]
    },
    flexWrap: {
      label: t('pages.attribute.flex_wrap'),
      type: 'select',
      defaultValue: 'nowrap',
      values: [
        {label: t('pages.attribute.nowrap'), value:'nowrap'},
        {label: t('pages.attribute.wrap'), value:'wrap'},
        {label: t('pages.attribute.wrap_reverse'), value:'wrap-reverse'},
      ]
    },
    justifyContent: {
      label: t('pages.attribute.justify_content'),
      type: 'toggle-button',
      defaultValue: 'flex-start',
      values: [
        { value: 'flex-start', icon: _getJustifyContentIcon(sxAttrs.flexDirection, 'flex-start')},
        { value: 'flex-end', icon: _getJustifyContentIcon(sxAttrs.flexDirection, 'flex-end')},
        { value: 'center', icon: _getJustifyContentIcon(sxAttrs.flexDirection, 'center')},
        { value: 'space-between', icon: _getJustifyContentIcon(sxAttrs.flexDirection, 'space-between')},
        { value: 'space-around', icon: _getJustifyContentIcon(sxAttrs.flexDirection, 'space-around')},
      ]
    },
    alignItems: {
      label: t('pages.attribute.align_items'),
      type: 'toggle-button',
      defaultValue: 'stretch',
      values: [
        { value: 'stretch', icon: _getAlignItemsIcon(sxAttrs.flexDirection, 'stretch')},
        { value: 'flex-start', icon: _getAlignItemsIcon(sxAttrs.flexDirection, 'flex-start')},
        { value: 'flex-end', icon: _getAlignItemsIcon(sxAttrs.flexDirection, 'flex-end')},
        { value: 'center', icon: _getAlignItemsIcon(sxAttrs.flexDirection, 'center')},
        { value: 'baseline', icon: _getAlignItemsIcon(sxAttrs.flexDirection, 'baseline')},
      ]
    },
  }

  return (
    <>
      {
        Object.entries(AttrMap).map(([attributeKey, attrValue]) => (
          <Stack direction="row" alignContent="center" justifyContent="space-between" spacing={2}>
            <AttrDisplayLabel label={attrValue.label} />
            {
              attrValue.type === 'toggle-button' ? <AttrToggleButton initialValue={sxAttrs[attributeKey] || attrValue.defaultValue} onChange={onChange} options={attrValue.values} attributeKey={attributeKey} /> : null
            }
            {
              attrValue.type === 'select' ? <AttrSelect initialValue={sxAttrs[attributeKey] || attrValue.defaultValue} onChange={onChange} options={attrValue.values} attributeKey={attributeKey} /> : null
            }
          </Stack>
        ))
      }
    </>
  );
}
