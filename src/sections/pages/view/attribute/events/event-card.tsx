import { useCallback, useEffect, useMemo, useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Typography from '@mui/material/Typography';
import Stack from '@mui/system/Stack';
import MenuItem from '@mui/material/MenuItem';
import AdsClickIcon from '@mui/icons-material/AdsClick';
import { IconButton, InputAdornment, Modal, TextField } from '@mui/material';
import AdjustIcon from '@mui/icons-material/Adjust';
import EditNoteIcon from '@mui/icons-material/EditNote';
// components
import { useSnackbar } from 'src/components/snackbar';
// hooks
import { useParams, useRouter } from 'src/routes/hook';
import { useAttributeEditor } from 'src/sections/pages/hooks';
import { useLocales } from 'src/locales';
import { paths } from 'src/routes/paths';
//
import FunctionFlow from 'src/sections/flow-functions/index'

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&::before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

type TProps = {
  id: string;
  eventTypes: { label: string, key: string }[];
  eventInitKey: string;
  eventInitValue: string;
  eventIndex: number;
  onDeleteEventById: (key: string) => void;
  existsEventKeys: string[];
};
export default function EventCard({ existsEventKeys, id, eventTypes, eventIndex, eventInitKey, eventInitValue, onDeleteEventById }: TProps) {
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  const { enqueueSnackbar } = useSnackbar();
  const [expanded, setExpanded] = useState<string | false>('panel1');
  const params = useParams();
  const projectID = params.projectID as string;
  const [selectedEventKey, setSelectedEventKey] = useState(eventInitKey);
  const [selectedEventFunc, setSelectedEventFunc] = useState(eventInitValue);
  const [eventErrorMessage, setEventErrorMessage] = useState('');
  const { currentAttributesConfig, currentComponentAttr, onAttributesConfigChange, functionList, componentTranslation } = useAttributeEditor();
  const { t } = useLocales()
  const router = useRouter();
  const [openFunctionFlow, setOpenFunctionFlow] = useState(false);
  
  useEffect(() => setSelectedEventKey(eventInitKey), [eventInitKey]);
  useEffect(() => setSelectedEventFunc(eventInitValue), [eventInitValue]);

  const config: { [key: string]: any } = useMemo(() => ({}), [])
  const onConfigChange = useCallback((key: string, value: any, type: string) => {
    switch (type) {
      case 'JSON':
        config[key] = JSON.parse(value)    
        break;
      case 'boolean':
        config[key] = Boolean(value)
        break;
      case 'number':
        config[key] = Number(value)
        break;
    
      default:
        config[key] = value
        break;
    }
  }, [config])
  const handleDeleteEvent = () => {
    config[selectedEventKey] = '';
    onAttributesConfigChange(projectID, config);
    onDeleteEventById(id);
    setSelectedEventFunc('');
    setSelectedEventKey('');
  }

  return (
    <Accordion key={currentComponentAttr?.elementID} expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
      <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" sx={{ '.MuiAccordionSummary-content': { justifyContent: 'space-between' } }}>
        <Typography>{t('pages.events.event')} #{eventIndex}</Typography>
        <HighlightOffIcon onClick={() => handleDeleteEvent()} />
      </AccordionSummary>
      <AccordionDetails>
        <Stack
          direction="column"
          sx={{ fontSize: '14px', py: '5px' }}
          spacing={3}
        >
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <AdsClickIcon />
            <TextField
              select
              fullWidth
              label={t('pages.events.please_select_event_type')}
              size='small'
              name="selectedEventKey"
              error={!!eventErrorMessage}
              helperText={eventErrorMessage}
              value={selectedEventKey || eventInitKey}
              disabled={!!selectedEventFunc}
              onChange={(e) => {
                const value = e.target.value;
                if (existsEventKeys.includes(value)) {
                  enqueueSnackbar(t('pages.events.event_exists'), { variant: 'error' });
                  return;
                }

                setSelectedEventKey(e.target.value);
                setEventErrorMessage('');
              }}
            >
              {eventTypes.map(({ label, key }) => <MenuItem disabled={existsEventKeys.includes(key)} key={key} value={key}>{label}</MenuItem>)}
            </TextField>
          </Stack>

          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <AdjustIcon />
            <TextField
              select
              fullWidth
              label={t('pages.events.please_select_event_function')}
              size='small'
              name="eventFunc"
              value={selectedEventFunc || eventInitValue}
              InputProps={{
                endAdornment: selectedEventFunc && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setOpenFunctionFlow(true)} size="small" edge="end" sx={{ marginRight: '15px' }}>
                      <EditNoteIcon sx={{ fontSize: '18px' }} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onChange={(e) => {
                if (!selectedEventKey) {
                  setEventErrorMessage(t('pages.events.select_event_type_first'));
                  return;
                };
                setSelectedEventFunc(e.target.value);

                const currentConfigIndex = Object.keys(currentAttributesConfig).find(key => currentAttributesConfig[Number(key)].key === selectedEventKey);
                const currentConfig = currentAttributesConfig[Number(currentConfigIndex)];
                onConfigChange(currentConfig.key, e.target.value, currentConfig.type);
                onAttributesConfigChange(projectID, config)
                if (id.indexOf('event-') !== -1) {
                  onDeleteEventById(id);
                }
              }}
            >
              {functionList.map(({ name }) => <MenuItem key={name} value={name}>{name}</MenuItem>)}
            </TextField>
          </Stack>
        </Stack>
      </AccordionDetails>
      <Modal
        open={openFunctionFlow}
        onClose={() => setOpenFunctionFlow(false)}
      >
        <FunctionFlow functionName={selectedEventFunc} setOpen={setOpenFunctionFlow} type="edit"/>
      </Modal>
    </Accordion>
  );
}
