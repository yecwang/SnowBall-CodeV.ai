import { useEffect, useState } from 'react';
import _ from 'lodash';
// @mui
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';
// locales
import { useLocales } from 'src/locales';
import { UploadIllustration } from 'src/assets/illustrations';
//
import { useAttributeEditor } from '../../../hooks';
import EventCard from './event-card';

export default function Events() {
  const { t } = useLocales()
  const { currentAttributesConfig, currentComponentAttr, componentTranslation } = useAttributeEditor();
  const isExistsFunctionSelectEvent = Object.keys(currentAttributesConfig).find(key => currentAttributesConfig[Number(key)].component === 'FunctionSelect');
  const eventTypes = Object.keys(currentAttributesConfig)
    .filter(key => currentAttributesConfig[Number(key)].component === 'FunctionSelect')
    .map(key => {
      const currentConfig = currentAttributesConfig[Number(key)];
      return { label: componentTranslation(currentConfig.label), key: currentConfig.key };
    });
  const existsEvents = Object.keys(currentAttributesConfig)
    .filter(key => currentAttributesConfig[Number(key)].component === 'FunctionSelect' && currentAttributesConfig[Number(key)].value)
    .map(key => {
      const currentConfig = currentAttributesConfig[Number(key)];
      return { id: currentConfig.key, key: currentConfig.key, value: currentConfig.value };
    });

  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    setEvents([]);
  }, [currentComponentAttr?.elementID]);

  const onDeleteEventById = (id: string) => {
    const newEvents = events.filter(item => item.id !== id);
    console.log(newEvents, id)
    setEvents(newEvents);
  }

  if (!isExistsFunctionSelectEvent) {
    return null;
  }

  return <Stack spacing={1} sx={{ p: '10px' }}>
    <Button variant="outlined" onClick={() => {
      setEvents([...events, { id: `event-${events.length}`, key: '', value: '' }]);
    }}>{t('pages.events.add_events')}</Button>
    {
      !existsEvents.length && !events.length ? <Stack spacing={3} sx={{ mt: 20 }} alignItems="center" justifyContent="center" flexWrap="wrap">
        <UploadIllustration sx={{ width: 1, maxWidth: 200 }} />
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {t('pages.events.no_event_prompt')}
        </Typography>
      </Stack> : null
    }
    <Stack direction="column" spacing={2}>
      {
        existsEvents.concat(events).map(({ id, key, value }, index) => <EventCard
          id={id}
          existsEventKeys={existsEvents.map(item => item.key)}
          eventTypes={eventTypes}
          eventInitKey={key}
          eventInitValue={value || ''}
          onDeleteEventById={onDeleteEventById}
          eventIndex={index + 1}
          />
        )
      }
    </Stack>
  </Stack>
}
