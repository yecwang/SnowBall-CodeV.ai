import { Stack } from '@mui/material';
import { AttrRender } from '../common/components';
import { TAttributeEditProps } from '../common/type';
import { config } from './config';
import AttributeImage from './AttributeImage';

export function ImageAttribute(props: TAttributeEditProps) {
  const attributes = [
    {
      key: "alt",
      "label": "@@@description",
      "component": "TextField",
      "defaultValue": ""
    },
  ]

  return <>
    <AttrRender {...props} attributes={attributes} locales={config.locales} />
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
    >
      <AttributeImage language={props.language} getImages={props.getImages} src={props.componentAttribute.src} projectID={props.projectID} onChange={props.onChange} uploadImage={props.onUploadImage} />
    </Stack>
  </>
}

