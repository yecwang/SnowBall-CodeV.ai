import * as React from 'react';
import _ from 'lodash';
// @mui
import { Stack, Typography } from '@mui/material';
import { UploadIllustration } from 'src/assets/illustrations';
import { useLocales } from 'src/locales';
import { useParams } from 'src/routes/hook';
//
import { useAttributeEditor } from '../../../hooks';
import ExteriorProps from './exterior-props';
import ExteriorLayout from './exterior-layout';
import ExteriorFont from './exterior-font';
import ExteriorBorder from './exterior-border';
import ExteriorAISummary from './exterior-ai-summary';
import ExteriorAIEdit from './exterior-ai-edit';

export default function Exterior() {
  const _onSXChange = (obj: any) => {
    if (!currentComponentAttr) {
      return;
    }

    onAttributesConfigChange(projectID, {
      ...currentComponentAttr.attributes,
      sx: {
        ...currentComponentAttr.attributes.sx,
        ...obj
      }
    })
  }

  const { t } = useLocales()
  const params = useParams();
  const projectID = params?.projectID as string;
  const { currentComponentAttr, onAttributesConfigChange } = useAttributeEditor();

  if (!currentComponentAttr) {
    return <Stack spacing={3} sx={{ mt: 20 }} alignItems="center" justifyContent="center" flexWrap="wrap">
      <UploadIllustration sx={{ width: 1, maxWidth: 200 }} />
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {t('pages.attribute.no_selection_component')}
      </Typography>
    </Stack>;
  }

  return <Stack spacing={1}>
    <ExteriorProps />
    <ExteriorAISummary />
    <ExteriorAIEdit />
    <ExteriorLayout onChange={_onSXChange} />
    <ExteriorFont onChange={_onSXChange} />
    <ExteriorBorder onChange={_onSXChange} />
  </Stack>
  
}
