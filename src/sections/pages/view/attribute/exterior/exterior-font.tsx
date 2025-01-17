import { Box, Stack, TextField, Typography, Input } from "@mui/material";
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import CurrencyPoundIcon from '@mui/icons-material/CurrencyPound';

import { useLocales } from "src/locales";
import { useAttributeEditor } from "../../../hooks";
import { AttrColor, AttrFontSize, AttrToggleButton, Accordions, AttrInput, AttrDisplayLabel, AttrSelect, AttrBoxStyleControl } from '../components';
import ExteriorShadow from "./exterior-shadow";

type TProps = {
  onChange: (obj: any) => void
}
export default function ExteriorFont({ onChange }: TProps) {
  const _handleBoldUnderlineItalics = (value: string[]) => {
    let textDecoration = '';
    if (value.includes('underline')) {
      textDecoration += ' underline';
    }
    if (value.includes('line-through')) {
      textDecoration += ' line-through';
    }
    onChange({
      fontWeight: value.includes('bold') ? 'bold' : undefined,
      fontStyle: value.includes('italic') ? 'italic' : undefined,
      textDecoration: textDecoration || undefined,
    });
  }
  const _onTextOverFlow = (obj: any) => {
    const value = obj.textOverflow;
    const result: { [key: string]: string | undefined } = {
      overflow: undefined,
      textOverflow: undefined,
      whiteSpace: undefined,
    };
    if (value === 'ellipsis') {
      result.overflow = 'hidden';
      result.textOverflow = 'ellipsis';
      result.whiteSpace = 'nowrap';
    }
    if (value === 'hidden' || value === 'scroll') {
      result.overflow = value;
      result.textOverflow = 'unset';
      result.whiteSpace = 'nowrap';
    }
    if (value === 'unset') {
      result.overflow = 'unset';
      result.textOverflow = 'unset';
      result.whiteSpace = 'unset';
    }
    onChange(result);
  }
  const _buildTextOverflowValue = () => {
    if (sxAttrs.overflow === 'hidden' && sxAttrs.textOverflow === 'ellipsis') {
      return 'ellipsis';
    }
    if (sxAttrs.overflow === 'hidden' || sxAttrs.overflow === 'scroll') {
      return sxAttrs.overflow;
    }

    return 'unset';
  }
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

  const textAlignOptions = [
    { value: 'left', icon: <FormatAlignLeftIcon /> },
    { value: 'center', icon: <FormatAlignCenterIcon /> },
    { value: 'right', icon: <FormatAlignRightIcon /> },
    { value: 'justify', icon: <FormatAlignJustifyIcon /> },
  ]
  const BoldUnderlineItalicsOptions = [
    { value: 'bold', icon: <FormatBoldIcon /> },
    { value: 'italic', icon: <FormatItalicIcon /> },
    { value: 'underline', icon: <FormatUnderlinedIcon /> },
    { value: 'line-through', icon: <CurrencyPoundIcon /> },
  ];
  const shadowValue = _buildShadowValue('textShadow');
  const AttrMap = {
    letterSpacing: {
      label: t('pages.attribute.letter_spacing'),
      component: 'attr-input',
    },
    lineHeight: {
      label: t('pages.attribute.line_height'),
      component: 'attr-input',
    },
    textIndent: {
      label: t('pages.attribute.text_indent'),
      component: 'attr-input',
    },
    textOverflow: {
      label: t('pages.attribute.text_overflow'),
      component: 'attr-select',
      options: [
        { value: 'hidden', label: t('pages.attribute.hidden') },
        { value: 'ellipsis', label: t('pages.attribute.ellipsis') },
        { value: 'scroll', label: t('pages.attribute.scroll') },
        { value: 'unset', label: t('pages.attribute.unset') },
      ]
    },
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
  
  return (
    <Accordions title={t('pages.attribute.text')}>
      <Stack direction="column" spacing={2}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <AttrFontSize initialSize={sxAttrs.fontSize} onChange={onChange} />
          <AttrColor attributeKey='color' initialValue={sxAttrs.color} onChange={onChange} />
          <AttrToggleButton
            initialValue={[sxAttrs.fontWeight, sxAttrs.fontStyle, sxAttrs.textDecoration]}
            attributeKey="bold-underlined-italics" 
            isMultiple
            options={BoldUnderlineItalicsOptions}
            onChange={(obj) => _handleBoldUnderlineItalics(obj['bold-underlined-italics'])} 
          />
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <AttrToggleButton onChange={onChange} initialValue={sxAttrs.textAlign} options={textAlignOptions} attributeKey="textAlign" />
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <AttrInput label={AttrMap.letterSpacing.label} type="number" unit='px' sx={{ width: "80px" }} initialValue={sxAttrs.letterSpacing} onChange={onChange} attributeKey="letterSpacing" icon="gg:font-spacing" />
          <AttrInput label={AttrMap.lineHeight.label} type="number" unit='px' sx={{ width: "80px" }} initialValue={sxAttrs.lineHeight} onChange={onChange} attributeKey="lineHeight" icon="mdi:format-line-height" />
          <AttrInput label={AttrMap.textIndent.label} type="number" unit='em' sx={{ width: "80px" }} initialValue={sxAttrs.textIndent} onChange={onChange} attributeKey="textIndent" icon="ph:text-indent" />
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <AttrDisplayLabel label={AttrMap.textOverflow.label} />
          <AttrSelect initialValue={_buildTextOverflowValue()} onChange={_onTextOverFlow} options={AttrMap.textOverflow.options} attributeKey="textOverflow" />
        </Stack>
        <ExteriorShadow attributeKey="textShadow" onChange={onChange} />
      </Stack>
    </Accordions>
  )
}
