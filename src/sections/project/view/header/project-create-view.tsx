'use client'

import * as Yup from 'yup';
import { useMemo } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import DialogActions from '@mui/material/DialogActions';
import CardHeader from '@mui/material/CardHeader';
import Card from '@mui/material/Card';
// locale
import { useLocales } from 'src/locales';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFTextField,
} from 'src/components/hook-form';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
import { paths } from 'src/routes/paths';
import useServerAction from 'src/hooks/use-server-action';
import { createProject } from 'src/services/server-actions/project/client';

// ----------------------------------------------------------------------

export default function ProjectCreateDialogView({ closeDialog }: { closeDialog: () => void }) {
  const { t } = useLocales()
  const { enqueueSnackbar } = useSnackbar();
  const mdUp = useResponsive('up', 'md');
  const { isLoading, run } = useServerAction(createProject);

  const NewProjectSchema = Yup.object().shape({
    name: Yup.string().required(t('project.new_edit.name_required')),
    description: Yup.string().required(t('project.new_edit.description_required')),
  });

  const defaultValues = useMemo(
    () => ({
      name: '',
      description: '',
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(NewProjectSchema),
    defaultValues,
  });

  const {
    handleSubmit,
  } = methods;

  const onSubmit = handleSubmit(async data => {
    await run(data);
    // TODO:
    enqueueSnackbar('Create project success!');
    closeDialog();
  });

  const renderProperties = (
    <Grid xs={12} md={12}>
      <Card>
        {!mdUp && <CardHeader title="Properties" />}
        <Stack spacing={3} sx={{ p: 3 }}>
          <RHFTextField name="name" label={t("project.new_edit.name")} />
          <RHFTextField name="description" label={t("project.new_edit.description")} multiline rows={4} />
        </Stack>
      </Card>
    </Grid>
  );

  const renderActions = (
    <DialogActions>
      <Button variant="outlined" color="inherit" onClick={closeDialog} >
        {t('project.new_edit.cancel')}
      </Button>
      <LoadingButton
        type="submit"
        variant="contained"
        loading={isLoading}
        sx={{ ml: 2 }}
      >
        {t('project.new_edit.submit')}
      </LoadingButton>
    </DialogActions>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid sx={{ margin: '12px' }} container spacing={3}>
        {renderProperties}
      </Grid>
      {renderActions}
    </FormProvider>
  );
}
