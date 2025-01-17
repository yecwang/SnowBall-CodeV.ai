export const config = {
  "label": "@@@label",
  "name": "Box",
  "icon": 'radix-icons:box',
  "importCode": ["import { Box } from 'ui-lib';", "import funs from 'funs';"],
  "code": "<Box id=\"@@@attributes.id\" sx={@@@attributes.sx}></Box>",
  "attributes": {
    "id": "box_id",
    "sx": {
      "display": "flex",
      "flexDirection": "column",
      "width": "100%",
      "minHeight": "50px",
    }
  },
  "attributesConfig": {
    "id": {
      "label": "@@@component_id",
      "component": "label",
      "defaultValue": "btn_id"
    },
    "sx": {
      "label": "@@@style",
      "component": ["layout", "basestyle", "text"],
      "defaultValue": "{\"display\":\"flex\",\"width\":\"100%\"}"
    }
  },
  "locales": {
    "en": {
      "label": "Box Container",
      "component_id": "Component ID",
      "style": "Style"
    },
    "cn": {
      "label": "盒容器",
      "component_id": "组件ID",
      "style": "样式"
    }
  }
}
