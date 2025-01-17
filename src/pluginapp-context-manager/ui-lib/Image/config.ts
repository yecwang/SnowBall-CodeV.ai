export const config = {
  "label": "@@@label",
  "name": "Image",
  "icon": 'ph:image-light',
  "importCode": ["import { Image } from 'ui-lib';", "import funs from 'funs';"],
  "attributes": {
    "id": "btn_id",
    "src": "/api/image?filename=hero.jpg&type=system",
    "sx": {
      "width": "100%",
      "height": "150px"
    }
  },
  "locales": {
    "en": {
      "label": "Image",
      "src": "Image Source",
      "description": "Description",
      "style": "Style",
      "select_image": "Select Image",
      "system_image": "System Image",
      "my_image": "My Image",
      "upload_from_local": "Upload from Local",
      "image_library": "Image Library",
      "upload_files": "Upload Files",
      "upload": "Upload",
    },
    "cn": {
      "label": "图像",
      "src": "图片地址",
      "description": "描述",
      "style": "样式",
      "select_image": "选择图像",
      "system_image": "系统图片",
      "my_image": "我的图片",
      "upload_from_local": "本地上传",
      "image_library": "图像库"
    }
  }
}
