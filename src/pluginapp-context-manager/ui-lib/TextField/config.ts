export const config = {
  "label": "@@@label",
  "name": "TextField",
  "icon": 'tdesign:component-input',
  "importCode": ["import { TextField } from 'ui-lib';", "import funs from 'funs';"],
  "attributesConfig": {
    "FUN_onChange": {
      "label": "@@@on_change",
      "type": "string",
      "component": "FunctionSelect",
      "defaultValue": ""
    },
    "FUN_onEnter": {
      "label": "@@@on_enter",
      "type": "string",
      "component": "FunctionSelect",
      "defaultValue": ""
    },
    "FUN_onFocus": {
      "label": "@@@on_focus",
      "type": "string",
      "component": "FunctionSelect",
      "defaultValue": ""
    },
    "FUN_onBlur": {
      "label": "@@@on_blur",
      "type": "string",
      "component": "FunctionSelect",
      "defaultValue": ""
    },
    "FUN_onKeyDown": {
      "label": "@@@on_key_down",
      "type": "string",
      "component": "FunctionSelect",
      "defaultValue": ""
    },
    "FUN_onKeyUp": {
      "label": "@@@on_key_up",
      "type": "string",
      "component": "FunctionSelect",
      "defaultValue": ""
    },
  },
  "locales": {
    "cn": {
      "label": "输入框",
      "default_value": "默认值",
      "placeholder": "占位符",
      "multiline": "多行",
      "type": "类型",
      "password": "密码",
      "number": "数字",
      "text": "文本",
      "on_change": "文本发生变化",
      "on_enter": "文本输入结束",
      "on_focus": "文本框获得焦点",
      "on_blur": "文本框失去焦点",
      "on_key_down": "按下键盘",
      "on_key_up": "松开键盘",
    },
    "en": {
      "label": "Input",
      "placeholder": "Placeholder",
      "default_value": "Default Value",
      "multiline": "Multiline",
      "type": "Type",
      "password": "Password",
      "number": "Number",
      "text": "Text",
      "on_change": "Text Change Event",
      "on_enter": "Text Enter Event",
      "on_focus": "Text Focus Event",
      "on_blur": "Text Blur Event",
      "on_key_down": "Key Down Event",
      "on_key_up": "Key Up Event",
    }
  }
}
