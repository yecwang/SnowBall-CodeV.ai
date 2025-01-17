import { Stack } from "@mui/material";
import { useLocales } from "src/locales";
import Accordions from "../components/accordions";
import { useAttributeEditor } from "../../../hooks";
import { AttrBoxStyleControl, AttrColor, AttrDisplayLabel, AttrInput, AttrPercentSlider, AttrWidthHeight } from '../components';
import LayoutContainer from './exterior-layout-container';

type TProps = {
  onChange: (obj: any) => void
}
export default function ExteriorLayout({ onChange }: TProps) {
  const { t } = useLocales()
  const { currentComponentAttr } = useAttributeEditor();
  const attrs = currentComponentAttr?.attributes || {}
  const sxAttrs = attrs?.sx || {}

  const widthHeightOptions = [
    { label: t('pages.attribute.rem'), value: 'rem' },
    { label: t('pages.attribute.pixel'), value: 'px' },
    { label: t('pages.attribute.auto'), value: 'auto' },
    { label: t('pages.attribute.percent'), value: '%' },
  ]
  const AttrMap = {
    width: {
      label: t('pages.attribute.width'),
      component: 'attr-w-h',
      options: widthHeightOptions,
    },
    height: {
      label: t('pages.attribute.height'),
      component: 'attr-w-h',
      options: widthHeightOptions
    },
    margin: {
      label: t('pages.attribute.margin'),
      component: 'attr-box-style-control',
      options: [
        { label: t('pages.attribute.top'), value: sxAttrs['margin-top'], key: 'margin-top', icon: 'vaadin:margin-top' },
        { label: t('pages.attribute.bottom'), value: sxAttrs['margin-bottom'], key: 'margin-bottom', icon: 'vaadin:margin-bottom' },
        { label: t('pages.attribute.left'), value: sxAttrs['margin-left'], key: 'margin-left', icon: 'vaadin:margin-left' },
        { label: t('pages.attribute.right'), value: sxAttrs['margin-right'], key: 'margin-right', icon: 'vaadin:margin-right' },
      ]
    },
    padding: {
      label: t('pages.attribute.padding'),
      component: 'attr-box-style-control',
      options: [
        { label: t('pages.attribute.top'), value: sxAttrs['padding-top'], key: 'padding-top', icon: 'vaadin:padding-top' },
        { label: t('pages.attribute.bottom'), value: sxAttrs['padding-bottom'], key: 'padding-bottom', icon: 'vaadin:padding-bottom' },
        { label: t('pages.attribute.left'), value: sxAttrs['padding-left'], key: 'padding-left', icon: 'vaadin:padding-left' },
        { label: t('pages.attribute.right'), value: sxAttrs['padding-right'], key: 'padding-right', icon: 'vaadin:padding-right' },
      ]
    },
    backgroundColor: {
      label: t('pages.attribute.background'),
      component: 'attr-color',
      options: []
    },
    opacity: {
      label: t('pages.attribute.opacity'),
      component: 'attr-percent-slider',
      options: []
    },
    zIndex: {
      label: t('pages.attribute.z_index'),
      component: 'attr-input',
      options: []
    }
  }

  return (
    <Accordions title={t('pages.attribute.layout')}>
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
                attrValue.component === 'attr-w-h' ? <AttrWidthHeight attributeKey={attributeKey} initialValue={sxAttrs?.[attributeKey]} onChange={onChange} options={attrValue.options as typeof AttrMap.width.options} /> : null
              }
              {
                attrValue.component === 'attr-box-style-control' ? <AttrBoxStyleControl options={attrValue.options as typeof AttrMap.margin.options} onChange={onChange} /> : null
              }
              {
                attrValue.component === 'attr-color' ? <AttrColor attributeKey={attributeKey} initialValue={sxAttrs?.[attributeKey]} onChange={onChange} /> : null
              }
              {
                attrValue.component === 'attr-percent-slider' ? <AttrPercentSlider initialValue={sxAttrs?.[attributeKey]} onChange={onChange} attributeKey={attributeKey} /> : null
              }
              {
                attrValue.component === 'attr-input' ? <AttrInput type="number" initialValue={sxAttrs?.[attributeKey]} onChange={onChange} attributeKey={attributeKey} /> : null
              }
            </Stack>
          ))
        }
        <LayoutContainer onChange={onChange} />
      </Stack>
    </Accordions>
  );
}
