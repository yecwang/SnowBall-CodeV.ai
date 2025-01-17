import { useEffect, useState } from "react";
import { AttrRender } from '../common/components';
import { TAttributeEditProps } from '../common/type';
import { config } from './config';

export function Attribute(props: TAttributeEditProps) {
  const { componentAttribute, onChange, language } = { ...props };
  const [defaultValue, setDefaultValue] = useState(componentAttribute.defaultValue);
  const [readOnly, setReadOnly] = useState(componentAttribute.readOnly);
  const [maxDate, setMaxDate] = useState(componentAttribute.maxDate);
  const [minDate, setMinDate] = useState(componentAttribute.minDate);
  const [valueLabelDisplay, setValueLabelDisplay] = useState(componentAttribute.valueLabelDisplay);

  useEffect(() => { setDefaultValue(componentAttribute.defaultValue) }, [componentAttribute.defaultValue]);
  useEffect(() => { setReadOnly(componentAttribute.readOnly) }, [componentAttribute.readOnly]);
  useEffect(() => { setMaxDate(componentAttribute.maxDate) }, [componentAttribute.maxDate]);
  useEffect(() => { setMinDate(componentAttribute.minDate) }, [componentAttribute.minDate]);


  const attributes = [
    
    {
      "key": "maxDate",
      "label": "@@@maxDate",
      "component": "TextField"
    },
    {
      "key": "minDate",
      "label": "@@@minDate",
      "component": "TextField"
    },
    {
      "key": "defaultValue",
      "label": "@@@defaultValue",
      "component": "TextField"
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