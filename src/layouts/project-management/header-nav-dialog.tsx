import { useCallback } from 'react';
// @mui
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
// sections
import { ProjectCreateView, ProjectChooseView } from 'src/sections/project/view';
// hooks
// import { useBoolean } from 'src/hooks/use-boolean';

// ----------------------------------------------------------------------

type THeaderNavDialogProps = {
  dialog: {
    value: boolean;
    onTrue: () => void;
    onFalse: () => void;
    onToggle: () => void;
    setValue: React.Dispatch<React.SetStateAction<boolean>>;
  },
  title: string;
  operation: string;
}

const RenderDiaLogContent = ({ operation, closeDialog }: Pick<THeaderNavDialogProps, 'operation'> & { closeDialog: () => void}) => {
  if (operation === 'PROJECT_CREATE') {
    return <ProjectCreateView closeDialog={closeDialog} />;
  }

  if (operation === 'PROJECT_CHOOSE') {
    return <ProjectChooseView closeDialog={closeDialog} />
  }

  return null
}

export default function HeaderNavDialog({ dialog, title, operation }: THeaderNavDialogProps) {
  const handleClose = useCallback(
    () => {
      dialog.onFalse();
    },
    [dialog]
  );

  return (
    <div>
      <Dialog
        fullWidth
        open={dialog.value}
        // onClose={dialog.onFalse}
        onClose={() => handleClose()}
      >
        <DialogTitle>{title}</DialogTitle>

        <DialogContent>
          <RenderDiaLogContent operation={operation} closeDialog={dialog.onFalse} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
