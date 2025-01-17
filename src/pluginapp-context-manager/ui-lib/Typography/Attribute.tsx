import { AttrRender } from '../common/components';
import { TAttributeEditProps } from '../common/type';
import { config } from './config';

export function TextFieldAttribute(props: TAttributeEditProps) {
  const attributes = [
    {
      key: "defaultValue",
      "label": "@@@default_value",
      "component": "TextField",
      "defaultValue": ""
    },
    {
      "key": "placeholder",
      "label": "@@@placeholder",
      "component": "TextField",
      "defaultValue": ""
    },
    {
      "key": "type",
      "label": "@@@type",
      "component": "Select",
      "defaultValue": "text",
      "values": [
        { label: '@@@text', value: 'text' },
        { label: '@@@password', value: 'password' },
        { label: '@@@number', value: 'number' },
      ]
    },
    {
      "key": "multiline",
      "label": "@@@multiline",
      "component": "Switch",
      "defaultValue": false
    }
  ]

  return <AttrRender {...props} attributes={attributes} locales={config.locales} />
}

