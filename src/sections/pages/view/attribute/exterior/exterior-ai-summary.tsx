import { Alert, Button, Stack, Typography } from '@mui/material';
import LoadingButton from "@mui/lab/LoadingButton";
import { useEffect, useState } from 'react';
import { useLocales } from 'src/locales';
import { useAttributeEditor, useRunner } from "../../../hooks";
import { Accordions } from '../components';

export default function AISummary() {
  const _handleComponentText = async () => {
    setLoading(true);
    let response;
    try {
      const pageCode = getPageCode()
      response = await fetch('/api/gpt/summary-page-component', { method: 'POST', body: JSON.stringify({ code: pageCode, componentID: currentComponentAttr?.elementID }) });
    } catch(error) {
      setLoading(false);
      console.log('error', error);
    }
    if (!response || !response.body) {
      console.error('No response body');
      setLoading(false);
      return;
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    let done = false;
    let str = ''
    while (!done) {
      // eslint-disable-next-line no-await-in-loop
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunk = decoder.decode(value, { stream: true });
      const strArr = chunk.split('>')
      if (strArr.length === 2) {
        setMsg(`${str+strArr[0]}>`);
      }
      str += chunk;
    }
    setMsg(str);
    setLoading(false);
  };

  const { getPageCode } = useRunner();
  const { currentComponentAttr } = useAttributeEditor();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const { t } = useLocales()

  useEffect(() => { setMsg('') }, [currentComponentAttr?.elementID]);

  return (
    <Accordions title={t('pages.attribute.ai_summary')}>
       <Stack direction="column" spacing={1}>
        {
          !msg ? <Typography variant="body2">
            {t('pages.attribute.ai_summary_tip')}
          </Typography>
          : <Typography variant="body2" sx={{ lineHeight: '25px', letterSpacing: '1.5px' }}>
            {msg}
          </Typography>
        }
        
        <LoadingButton
          size="small"
          onClick={() => _handleComponentText()}
          color="primary"
          variant="outlined"
          loading={ loading }
        >
          {t('pages.attribute.component_literal_description')}
        </LoadingButton>
      </Stack>
    </Accordions>
  );
}