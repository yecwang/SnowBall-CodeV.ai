export const config = {
  "label": "@@@label",
  "name": "Typography",
  "icon": 'icon-park-outline:text',
  "importCode": ["import { Typography } from 'ui-lib';", "import funs from 'funs';"],
  "attributes": {
    "label": "Please enter text content",
  },
  "attributesConfig": {
    "FUN_onContextMenu": {
      "label": "@@@on_context_menu",
      "type": "string",
      "component": "FunctionSelect",
      "defaultValue": ""
    },
    "FUN_onMouseEnter": {
      "label": "@@@on_mouse_enter",
      "type": "string",
      "component": "FunctionSelect",
      "defaultValue": ""
    },
    "FUN_onMouseLeave": {
      "label": "@@@on_mouse_leave",
      "type": "string",
      "component": "FunctionSelect",
      "defaultValue": ""
    },
    "FUN_onCopy": {
      "label": "@@@on_copy",
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
      "label": "文本",
      "on_context_menu": "右键菜单",
      "on_mouse_enter": "鼠标移入",
      "on_mouse_leave": "鼠标移出",
      "on_copy": "复制",
      "on_key_down": "按下键盘",
      "on_key_up": "松开键盘",
      "text_default_value": "请输入文本内容",
    },
    "en": {
      "label": "Text",
      "on_context_menu": "Context Menu",
      "on_mouse_enter": "Mouse Enter",
      "on_mouse_leave": "Mouse Leave",
      "on_copy": "Copy",
      "on_key_down": "Key Down",
      "on_key_up": "Key Up",
      "text_default_value": "Please enter text content",
    }
  }
}
