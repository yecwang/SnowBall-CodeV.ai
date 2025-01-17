import { useEffect, useState } from "react";
import { AttrRender } from '../common/components';
import { TAttributeEditProps } from '../common/type';
import { config } from './config';

export function Attribute(props: TAttributeEditProps) {
  const { componentAttribute, onChange, language } = { ...props };
  const [sizeValue, setSizeValue] = useState(componentAttribute.size);
  const [defaultChecked, setDefaultChecked] = useState(componentAttribute.defaultChecked);
  const [readOnly, setReadOnly] = useState(componentAttribute.readOnly);

  useEffect(() => { setSizeValue(componentAttribute.size) }, [componentAttribute.size]);
  useEffect(() => { setDefaultChecked(componentAttribute.defaultChecked) }, [componentAttribute.defaultChecked]);
  useEffect(() => { setReadOnly(componentAttribute.readOnly) }, [componentAttribute.readOnly]);


  const attributes = [
    {
      "key": "defaultChecked",
      "label": "@@@defaultValue",
      "component": "Switch",
      "defaultValue": false
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