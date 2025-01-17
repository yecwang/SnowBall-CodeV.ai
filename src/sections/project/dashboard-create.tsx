import React, { ReactNode } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as projectActions from 'src/services/server-actions/project/client';
import useServerAction from 'src/hooks/use-server-action';
import { useSettingsContext } from 'src/components/settings';
import { HEADER } from 'src/layouts/config-layout';
import { useTheme } from '@mui/material/styles';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DataSaverOnIcon from '@mui/icons-material/DataSaverOn';
import LoadingButton from '@mui/lab/LoadingButton';
import i18n from 'i18next';
import {
  Typography,
  Box,
  Drawer,
  MenuItem,
  Stack,
} from '@mui/material';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFTextField,
} from 'src/components/hook-form';
import { useLocales } from 'src/locales';

const industries = [
  { value: 'value1', label: '行业1' },
  { value: 'value2', label: '行业2' },
]
const subdivisions = [
  { value: 'value1', label: '细分1' },
  { value: 'value2', label: '细分2' },
]
const options = [
  { value: 'value1', label: '手动' },
  { value: 'value2', label: '自动' },
]

interface FormModalProps {
  open: boolean;
  getProjectList: any;
  setNewModalOpen: (open: boolean) => void;
}

const ProjectItem = ({ title, children }: { title: ReactNode, children: ReactNode }) => <Stack
    direction="row"
    justifyContent="center"
    alignItems="center"
    spacing={9}
  >
    <Typography variant='inherit'>{title}</Typography>
    <Box sx={{ width: '280px' }}>{ children }</Box>
  </Stack>

const CreateProject: React.FC<FormModalProps> = ({ open, setNewModalOpen, getProjectList }) => {
  const _handleClose = () => {
    setNewModalOpen(false);
  };
  const _createProject = async (projectData: NewProjectSchemaType) => {
    const { data, error } = await create(projectData);
    if (data) {
      enqueueSnackbar('Create project success!');
    }

    _handleClose();

    getProjectList();
  }
  const _prepareSchemaAndDefaultValues = () => {
    const NewProjectSchema = Yup.object().shape({
      options: Yup.string().required('options is required'),
      name: Yup.string().required('name is required'),
      description: Yup.string().required('description is required'),
      industry: Yup.string().required('industry select is required'),
      subdivision: Yup.string().required('subdivision select is required'),
    });
    const defaultValues = {
      options: options[0].value,
      name: '',
      description: '',
      industry: industries[0].value,
      subdivision: subdivisions[0].value,
    };

    return {
      NewProjectSchema,
      defaultValues,
    }
  }
  const _renderTitle = () => <Stack
    direction="row"
    alignItems="center"
    justifyContent="space-between"
    sx={{
      background: (theme) => theme.palette.mode === 'light' ? '#D3E1F3' : undefined,
      height: '65px',
      width: '475px',
      px: '10px'
    }}
  >
    <Stack direction="row" spacing={0.5} justifyContent="center" alignItems="center">
      <NoteAddIcon />
      <Typography variant="h6">
        {i18n.t('project.dashboard.create_modal.new')}
      </Typography>
    </Stack>
    <ChevronRightIcon />
  </Stack>
  const _renderContent = () => <Stack
    direction="column"
    sx={{ fontSize: '14px', pt: '30px' }}
    spacing={3}
  >
    <ProjectItem title={i18n.t('project.dashboard.create_modal.new')}>
      <RHFSelect name="industry" label={i18n.t('project.dashboard.create_modal.options')}>
        {options.map(({ value, label }) => <MenuItem key={value} value={value}>{label}</MenuItem>)}
      </RHFSelect>
    </ProjectItem>
    <ProjectItem title={i18n.t('project.dashboard.create_modal.name')}>
      <RHFTextField name="name" label={t("project.dashboard.create_modal.name")} />
    </ProjectItem>
    <ProjectItem title={i18n.t('project.dashboard.create_modal.description')}>
      <RHFTextField name="description" label={t("project.dashboard.create_modal.description")} />
    </ProjectItem>
    <ProjectItem title={i18n.t('project.dashboard.create_modal.new')}>
      <RHFSelect name="industry" label={i18n.t('project.dashboard.create_modal.industry')}>
        {industries.map(({ value, label }) => <MenuItem key={value} value={value}>{label}</MenuItem>)}
      </RHFSelect>
    </ProjectItem>
    <ProjectItem title={i18n.t('project.dashboard.create_modal.new')}>
      <RHFSelect name="subdivision" label={i18n.t('project.dashboard.create_modal.subdivision')}>
        {subdivisions.map(({ value, label }) => <MenuItem key={value} value={value}>{label}</MenuItem>)}
      </RHFSelect>
    </ProjectItem>
  </Stack>
  const _renderSubmitBtn = () => <Box display="flex" sx={{ position: 'fixed', bottom: 0, right: 0, margin: 2 }}>
    <LoadingButton
      sx={{
        width: "430px",
        height: "50px",
        lineHeight: "20px",
        borderRadius: "5px",
        background: theme => theme.palette.mode === 'light' ? "linear-gradient(180deg, rgba(5,43,86,0.9) 100%,rgba(19,86,159,0.9) 0%)" : undefined,
        color: theme => theme.palette.mode === 'light' ? "rgba(208,223,242,1)" : undefined,
        fontSize: "16px",
        boxShadow: "0px 0px 3px 0px rgba(5,43,86,0.3)",
        border: theme => `1px solid ${theme.palette.divider}`
      }}
      type="submit"
      startIcon={<DataSaverOnIcon />}
      loading={isLoading}
    >
      {i18n.t('project.dashboard.create_modal.create')}
    </LoadingButton>
  </Box>

  const { run: create, isLoading } = useServerAction(projectActions.createProject);
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useLocales()
  
  const settings = useSettingsContext();
  const isNavHorizontal = settings.themeLayout === 'horizontal';
  const marginTop = isNavHorizontal ? HEADER.H_DESKTOP + HEADER.H_MOBILE : HEADER.H_DESKTOP;

  const { NewProjectSchema, defaultValues } = _prepareSchemaAndDefaultValues();
  type NewProjectSchemaType = Yup.InferType<typeof NewProjectSchema>;
  const methods = useForm({ resolver: yupResolver(NewProjectSchema), defaultValues });
  const onSubmit = methods.handleSubmit(_createProject);

  return (
    <Drawer
      open={open}
      onClose={_handleClose}
      anchor="right"
      sx={{
        '& .MuiDrawer-paper': {
          top: marginTop,
          height: `calc(100% - ${marginTop}px)`,
          background: (theme) => theme.palette.mode === 'light' ? theme.palette.background.gradient : undefined,
        },
        '.MuiBackdrop-root': {
          top: marginTop,
        },
      }}
    >
      {_renderTitle()}
      <FormProvider methods={methods} onSubmit={onSubmit}>
        {_renderContent()}
        {_renderSubmitBtn()}
      </FormProvider>
    </Drawer>
  );
};

export default CreateProject;
