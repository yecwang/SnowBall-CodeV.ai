export const config = {
  "label": "图标",
  "name": "Iconify",
  "icon": 'cil:smile',
  "importCode": ["import { Iconify } from 'ui-lib';", "import funs from 'funs';"],
  "code": "<Iconify id=\"@@@attributes.id\" icon=\"@@@attributes.icon\" width={@@@attributes.width} />",
  "attributes": {
    "id": "btn_id",
    "icon": "",
    "width": "24"
  },
  "attributesConfig": {
    "id": {
      "label": "id",
      "type": "string",
      "component": "TextField",
      "defaultValue": "btn_id"
    },
    "icon": {
      "label": "icon样式",
      "type": "string",
      "component": "TextField",
      "defaultValue": "cil:smile"
    },
    "width": {
      "label": "宽度",
      "type": "number",
      "component": "TextField",
      "defaultValue": "24"
    },
    "sx": {
      "label": "样式",
      "component": ["basestyle"],
      "defaultValue": "{}"
    }
    
  }
}
