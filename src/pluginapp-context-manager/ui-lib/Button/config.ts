export const config = {
  "label": "@@@label",
  "name": "Button",
  "icon": 'mdi:button-pointer',
  "importCode": ["import { Button } from 'ui-lib';", "import funs from 'funs';"],
  "attributes": {
    "label": "Button",
    "color": "primary",
    "variant": "contained",
    "sx": {
      "width": "6rem",
      "height": "2rem"
    }
  },
  "attributesConfig": {
    "id": {
      "label": "组件id",
      "type": "string",
      "component": "TextField",
      "defaultValue": "btn_id"
    },
    "label": {
      "label": "@@@button_name",
      "type": "string",
      "component": "TextField",
      "defaultValue": ""
    },
    "FUN_onClick": {
      "label": "@@@on_click",
      "type": "string",
      "component": "FunctionSelect",
      "defaultValue": ""
    },
    "FUN_onDoubleClick": {
      "label": "@@@on_double_click",
      "type": "string",
      "component": "FunctionSelect",
      "defaultValue": ""
    },
    "FUN_onContextMenu": {
      "label": "@@@on_context_menu",
      "type": "string",
      "component": "FunctionSelect",
      "defaultValue": ""
    },
  },
  "locales": {
    "cn": {
      "label": "按钮",
      "button_name": "按钮名称",
      "on_click": "点击事件",
      "on_double_click": "双击事件",
      "on_context_menu": "右键菜单事件",
    },
    "en": {
      "label": "Button",
      "button_name": "Button Name",
      "on_click": "Click event",
      "on_double_click": "Double-click event",
      "on_context_menu": "Right-click menu event",
    }
  }
}
