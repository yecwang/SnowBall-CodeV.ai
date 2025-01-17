import { Stack } from "@mui/material";
import { useLocales } from "src/locales";
import Accordions from "../components/accordions";
import { useAttributeEditor } from "../../../hooks";
import { AttrBoxStyleControl, AttrColor, AttrDisplayLabel, AttrInput, AttrPercentSlider, AttrToggleButton, AttrWidthHeight } from '../components';
import ExteriorShadow from "./exterior-shadow";

type TProps = {
  onChange: (obj: any) => void
}
export default function ExteriorBorder({ onChange }: TProps) {
  const { t } = useLocales()
  const { currentComponentAttr } = useAttributeEditor();
  const attrs = currentComponentAttr?.attributes || {}
  const sxAttrs = attrs?.sx || {}

  const AttrMap = {
    borderStyle: {
      label: t('pages.attribute.style'),
      component: 'attr-toggle-button',
      defaultValue: 'none',
      options: [
        { label: t('pages.attribute.solid'), value: 'solid', icon: 'mdi:border-all-variant' },
        { label: t('pages.attribute.dashed'), value: 'dashed', icon: 'ph:rectangle-dashed-light' },
      ],
    },
    borderColor: {
      label: t('pages.attribute.color'),
      component: 'color',
      defaultValue: '',
    },
    borderLine: {
      label: t('pages.attribute.line'),
      component: 'attr-box-style-control',
      defaultValue: '',
      options: [
        // { label: t('pages.attribute.top'), value: sxAttrs['border-top-width'], key: 'border-top-width' },
        // { label: t('pages.attribute.bottom'), value: sxAttrs['border-bottom-width'], key: 'border-bottom-width' },
        // { label: t('pages.attribute.left'), value: sxAttrs['border-left-width'], key: 'border-left-width' },
        // { label: t('pages.attribute.right'), value: sxAttrs['border-right-width'], key: 'border-right-width' },
        { label: t('pages.attribute.top'), value: sxAttrs['border-top-width'], key: 'border-top-width', icon: 'iconoir:border-top' },
        { label: t('pages.attribute.bottom'), value: sxAttrs['border-bottom-width'], key: 'border-bottom-width', icon: 'iconoir:border-bottom' },
        { label: t('pages.attribute.left'), value: sxAttrs['border-left-width'], key: 'border-left-width', icon: 'iconoir:border-left' },
        { label: t('pages.attribute.right'), value: sxAttrs['border-right-width'], key: 'border-right-width', icon: 'iconoir:border-right' },
      ]
    },
    borderRadius: {
      label: t('pages.attribute.radius'),
      component: 'attr-box-style-control',
      defaultValue: '',
      options: [
        // { label: t('pages.attribute.left_top'), value: sxAttrs['border-top-left-radius'], key: 'border-top-left-radius', icon: '' },
        // { label: t('pages.attribute.right_top'), value: sxAttrs['border-top-right-radius'], key: 'border-top-right-radius', icon: '' },
        // { label: t('pages.attribute.left_bottom'), value: sxAttrs['border-bottom-left-radius'], key: 'border-bottom-left-radius', icon: '' },
        // { label: t('pages.attribute.right_bottom'), value: sxAttrs['border-bottom-right-radius'], key: 'border-bottom-right-radius', icon: ''},
        { label: t('pages.attribute.left_top'), value: sxAttrs['border-top-left-radius'], key: 'border-top-left-radius', icon: 'iconoir:border-tl' },
        { label: t('pages.attribute.right_top'), value: sxAttrs['border-top-right-radius'], key: 'border-top-right-radius', icon: 'iconoir:border-tr' },
        { label: t('pages.attribute.left_bottom'), value: sxAttrs['border-bottom-left-radius'], key: 'border-bottom-left-radius', icon: 'iconoir:border-bl' },
        { label: t('pages.attribute.right_bottom'), value: sxAttrs['border-bottom-right-radius'], key: 'border-bottom-right-radius', icon: 'iconoir:border-br'},
      ]
    },
  }

  return (
    <Accordions title={t('pages.attribute.border')}>
      <Stack direction="column" spacing={3}>
        {
          Object.entries(AttrMap).map(([attributeKey, attrValue]) => (
            <Stack
              direction={attrValue.component === 'attr-box-style-control' ? 'column' : 'row'}
              alignContent="center"
              alignItems={attrValue.component === 'attr-box-style-control' ? 'flex-start' : 'center'}
              justifyContent="space-between"
              spacing={2}
            >
              <AttrDisplayLabel label={attrValue.label} />
              {
                attrValue.component === 'attr-toggle-button' ? <AttrToggleButton initialValue={sxAttrs[attributeKey] || attrValue.defaultValue} onChange={onChange} options={'options' in attrValue ? attrValue.options : []} attributeKey={attributeKey} /> : null
              }
              {
                attrValue.component === 'attr-box-style-control' ? <AttrBoxStyleControl options={'options' in attrValue ? attrValue.options as typeof AttrMap.borderLine.options: []} onChange={onChange} /> : null
              }
              {
                attrValue.component === 'color' ? <AttrColor attributeKey={attributeKey} initialValue={sxAttrs?.[attributeKey]} onChange={onChange} /> : null
              }
              {
                attrValue.component === 'percent-slider' ? <AttrPercentSlider initialValue={sxAttrs?.[attributeKey]} onChange={onChange} attributeKey={attributeKey} /> : null
              }
              {
                attrValue.component === 'input' ? <AttrInput type="number" initialValue={sxAttrs?.[attributeKey]} onChange={onChange} attributeKey={attributeKey} /> : null
              }
            </Stack>
          ))
        }
        <ExteriorShadow attributeKey="borderShadow" onChange={onChange} />
      </Stack>
    </Accordions>
  );
}
