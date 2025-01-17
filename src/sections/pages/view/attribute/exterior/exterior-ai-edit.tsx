import { Stack, TextField } from "@mui/material";
import { useLocales } from "src/locales";
import LoadingButton from "@mui/lab/LoadingButton";
import React from "react";
import Accordions from "../components/accordions";
import { useAttributeEditor, useRunner } from "../../../hooks";

export default function ExteriorAIStyle() {
  const _updatePageComponentAsync = async () => {
    setLoading(true);
    try {
      const pageCode = getPageCode()
      const response = await fetch('/api/gpt/update-page-component', { method: 'POST', body: JSON.stringify({ code: pageCode, componentID: currentComponentAttr?.elementID, prompt }) });
      const result = await response.json();
      if (!result || !result.data) {
        console.error('No response body');
        setLoading(false);
        return;
      }
      changeCode(projectID, pageID, result.data);
    } finally {
      setLoading(false);
    }
  }
  
  const { t } = useLocales()
  const { currentComponentAttr } = useAttributeEditor();
  const {projectID, pageID, changeCode, getPageCode } = useRunner();
  const [loading, setLoading] = React.useState(false);
  const [prompt, setPrompt] = React.useState('');

  if (!currentComponentAttr) {
    return null
  }

  return (
    <Accordions title={t('pages.attribute.ai_edit')}>
      <Stack direction="column" spacing={3}>
        <TextField
          id="outlined-multiline-flexible"
          label="Please enter the update content"
          multiline
          maxRows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <LoadingButton
          size="small"
          onClick={_updatePageComponentAsync}
          color="primary"
          variant="outlined"
          loading={loading}
        >
          {t('pages.attribute.component_update')}
        </LoadingButton>
      </Stack>
    </Accordions>
  );
}
