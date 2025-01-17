import { useEffect, useState } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Dialog, { DialogProps } from '@mui/material/Dialog';
// components
import Iconify from '../common/components/iconify';
import { Upload } from '../common/components/upload';
import { TAttributeEditProps } from '../common/type';
import { convertImageSrc , translate} from '../common/utils';
import { config } from './config';

// ----------------------------------------------------------------------

interface Props extends DialogProps {
  title?: string;
  //
  onCreate?: VoidFunction;
  onUpdate?: VoidFunction;
  //
  folderName?: string;
  onChangeFolderName?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  //
  open: boolean;
  onClose: VoidFunction;
  projectID: string;
  uploadImage: (formData: FormData) => any;
  onChange: TAttributeEditProps['onChange'];
  language: TAttributeEditProps['language'];
}

export default function AttributeImageUploadDialog({
  title = 'Upload Files',
  open,
  onClose,
  //
  onCreate,
  onUpdate,
  //
  folderName,
  onChangeFolderName,
  projectID,
  uploadImage,
  onChange,
  language,
  ...other
}: Props) {
  const [files, setFiles] = useState<(File | string)[]>([]);
  
  useEffect(() => {
    if (!open) {
      setFiles([]);
    }
  }, [open]);

  const handleDrop = (acceptedFiles: File[]) => {
    const newFile = acceptedFiles[0];
    Object.assign(newFile, {
      preview: URL.createObjectURL(newFile),
    })

    setFiles([newFile]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', files[0]);
    formData.append('projectID', projectID);
    const { data } = await uploadImage(formData)
    if (data.imageFilename) {
      onChange({ src: convertImageSrc(data.imageFilename, projectID, 'user') });
    }
    onClose();
  };

  const handleRemoveFile = (inputFile: File | string) => {
    const filtered = files.filter((file) => file !== inputFile);
    setFiles(filtered);
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
      <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}> {title} </DialogTitle>

      <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
        {(onCreate || onUpdate) && (
          <TextField
            fullWidth
            label="Folder name"
            value={folderName}
            onChange={onChangeFolderName}
            sx={{ mb: 3 }}
          />
        )}

        <Upload file={files[0]} onDrop={handleDrop} onRemove={handleRemoveFile} />
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          startIcon={<Iconify icon="eva:cloud-upload-fill" />}
          onClick={handleUpload}
        >
          {translate('upload', language, config.locales)}
        </Button>

        {(onCreate || onUpdate) && (
          <Stack direction="row" justifyContent="flex-end" flexGrow={1}>
            <Button variant="soft" onClick={onCreate || onUpdate}>
              {onUpdate ? 'Save' : 'Create'}
            </Button>
          </Stack>
        )}
      </DialogActions>
    </Dialog>
  );
}
