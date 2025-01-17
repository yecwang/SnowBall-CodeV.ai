import { useEffect, useState } from "react";
import { AttrRender } from '../common/components';
import { TAttributeEditProps } from '../common/type';
import { config } from './config';

export function Attribute(props: TAttributeEditProps) {
  const { componentAttribute, onChange, language } = { ...props };
  const [sizeValue, setSizeValue] = useState(componentAttribute.size);
  const [defaultValue, setDefaultValue] = useState(componentAttribute.defaultValue);
  const [readOnly, setReadOnly] = useState(componentAttribute.readOnly);
  const [max, setMax] = useState(componentAttribute.max);
  const [min, setMin] = useState(componentAttribute.min);
  const [valueLabelDisplay, setValueLabelDisplay] = useState(componentAttribute.valueLabelDisplay);

  useEffect(() => { setSizeValue(componentAttribute.size) }, [componentAttribute.size]);
  useEffect(() => { setDefaultValue(componentAttribute.defaultValue) }, [componentAttribute.defaultValue]);
  useEffect(() => { setReadOnly(componentAttribute.readOnly) }, [componentAttribute.readOnly]);
  useEffect(() => { setMax(componentAttribute.max) }, [componentAttribute.max]);
  useEffect(() => { setMin(componentAttribute.min) }, [componentAttribute.min]);
  useEffect(() => { setValueLabelDisplay(componentAttribute.valueLabelDisplay) }, [componentAttribute.valueLabelDisplay]);


  const attributes = [
    {
      "key": "orientation",
      "label": "@@@orientation",
      "component": "Select",
      "values": [
        { label: '@@@horizontal', value: 'horizontal' },
        { label: '@@@vertical', value: 'vertical' },
      ],
      "defaultValue": "horizontal"
    },
    {
      "key": "max",
      "label": "@@@max",
      "component": "TextField",
      "type": "number",
      "defaultValue": 10
    },
    {
      "key": "min",
      "label": "@@@min",
      "component": "TextField",
      "type": "number",
      "defaultValue": 0
    },
    {
      "key": "defaultValue",
      "label": "@@@defaultValue",
      "component": "TextField",
      "type": "number",
      "defaultValue": 5
    },
    {
      "key": "setValueLabelDisplay",
      "label": "@@@setValueLabelDisplay",
      "component": "Select",
      "values": [
        { label: '@@@auto', value: 'auto' },
        { label: '@@@off', value: 'off' },
        { label: '@@@on', value: 'on' },
      ],
      "defaultValue": "auto"
    },
    {
      "key": "size",
      "label": "@@@size",
      "component": "Select",
      "values": [
        { label: '@@@small', value: 'small' },
        { label: '@@@medium', value: 'medium' },
        { label: '@@@large', value: 'large' },
      ],
      "defaultValue": "medium"
    },
    {
      "key": "readOnly",
      "label": "@@@readOnly",
      "component": "Switch",
      "defaultValue": false
    },
  ]

  return <AttrRender {...props} attributes={attributes} locales={config.locales} />

}