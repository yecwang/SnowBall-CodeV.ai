import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFRadioGroup } from 'src/components/hook-form';
// redux
import { useSelector, useDispatch } from 'src/redux/store';
import { setFunctions } from 'src/redux/slices/project';
// hook
import { useSearchParams } from 'src/routes/hook';
import useServerAction from 'src/hooks/use-server-action';
//
import * as projectActions from 'src/services/server-actions/project/client';

// ----------------------------------------------------------------------

type Props = {
  onCloseDialog: VoidFunction;
};

const RETURN_VALUE = [
  { value: true, label: 'Yes' },
  { value: false, label: 'No' },
];

export default function NewFunctionForm({ onCloseDialog }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const projectID = Number(useSearchParams().get('projectID'));
  const { functions } = useSelector((state) => state.project[projectID]);
  const dispatch = useDispatch();
  const { run: updateFunctions } = useServerAction(projectActions.updateFunctions)
  
  const Schema = Yup.object().shape({
    name: Yup.string().max(255).required('name is required'),
    description: Yup.string().max(5000, 'Description must be at most 5000 characters').default(''),
    isReturn: Yup.boolean().default(false),
  });
  const methods = useForm({
    resolver: yupResolver(Schema),
    defaultValues: {
      name: '',
      description: '',
      isReturn: false,
    }
  });
  const { handleSubmit, formState: { isSubmitting } } = methods;
  const onSubmit = handleSubmit(async (data) => {
    const now = Date.now();
    const newFunctions = [...functions, { ...data, ctime: now, utime: now }];
    const { error } = await updateFunctions(projectID, newFunctions);
    if (!error) {
      dispatch(setFunctions({ projectID, functions: newFunctions }));
      onCloseDialog();
      enqueueSnackbar('New Function success!');
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ px: 3 }}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Name</Typography>
          <RHFTextField name="name" />
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Description</Typography>
          <RHFTextField name="description" multiline rows={2} />
        </Stack>

        <Stack spacing={1}>
          <Typography variant="subtitle2">Return value</Typography>
          <RHFRadioGroup row spacing={4} name="isReturn" options={RETURN_VALUE} />
        </Stack>
      </Stack>

      <DialogActions>
        <Box sx={{ flexGrow: 1 }} />

        <Button variant="outlined" color="inherit" onClick={onCloseDialog}>
          Cancel
        </Button>

        <LoadingButton
          type="submit"
          variant="contained"
          loading={isSubmitting}
          disabled={false}
        >
          Save Changes
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
}
