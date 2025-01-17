import { useEffect, useState } from "react";
import { AttrRender } from '../common/components';
import { TAttributeEditProps } from '../common/type';
import { config } from './config';

export function Attribute(props: TAttributeEditProps) {
  const { componentAttribute, onChange, language } = { ...props };
  const [sizeValue, setSizeValue] = useState(componentAttribute.size);
  const [defaultValue, setDefaultValue] = useState(componentAttribute.defaultValue);
  const [maxValue, setMaxValue] = useState(componentAttribute.max);
  const [readOnly, setReadOnly] = useState(componentAttribute.readOnly);
  const [precision, setPrecision] = useState(componentAttribute.precision);

  useEffect(() => { setSizeValue(componentAttribute.size) }, [componentAttribute.size]);
  useEffect(() => { setDefaultValue(componentAttribute.defaultValue) }, [componentAttribute.defaultValue]);
  useEffect(() => { setMaxValue(componentAttribute.max) }, [componentAttribute.max]);
  useEffect(() => { setReadOnly(componentAttribute.readOnly) }, [componentAttribute.readOnly]);
  useEffect(() => { setPrecision(componentAttribute.precision) }, [componentAttribute.precision]);


  const attributes = [
    {
      "key": "defaultValue",
      "label": "@@@defaultValue",
      "component": "TextField",
      "defaultValue": ""
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
      "key": "max",
      "label": "@@@max",
      "component": "TextField",
      "type": "number"
    },
    {
      "key": "precision",
      "label": "@@@precision",
      "component": "TextField",
      "type": "number",
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