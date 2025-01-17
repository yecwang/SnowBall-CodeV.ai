import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Tabs, Tab, IconButton, Box, Typography, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Draggable from 'react-draggable';
import { PaperProps } from '@mui/material/Paper';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { TAttributeEditProps } from '../common/type';
import { convertImageSrc, translate } from '../common/utils';
import { config } from './config';

function MasonryImageList({ images, projectID, type, onChange }: { images: string[], projectID: string, type: string, onChange: TAttributeEditProps['onChange'] }) {
  return (
    <Box>
      <ImageList variant="masonry" cols={2} gap={8}>
        {images.map((item) => {
          const src = convertImageSrc(item, projectID, type);
          return <ImageListItem key={item} sx={{ cursor: 'pointer' }} onClick={() => onChange({ src })}>
            <img
              srcSet={`${src}&w=248&fit=crop&auto=format&dpr=2 2x`}
              src={`${src}&w=248&fit=crop&auto=format`}
              alt={item}
              loading="lazy"
            />
          </ImageListItem>
        })}
      </ImageList>
    </Box>
  );
}

function PaperComponent(props: PaperProps) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

type TAttributeImageLibDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  projectID: string;
  getImages: TAttributeEditProps['getImages'];
  onChange: TAttributeEditProps['onChange'];
  language: TAttributeEditProps['language'];
};
export default function AttributeImageLibDialog({ open, setOpen, getImages, projectID, onChange, language }: TAttributeImageLibDialogProps) {
  const [activeTab, setActiveTab] = useState<number>(0);
  const handleClose = () => setOpen(false);
  const _getImages = async (type: 'system' | 'user') => {
    try {
      const result = await getImages({ projectID, type });
      if (result.data) {
        setImages(result.data);
      }
    } catch (error) {
      console.error('get image failed', error);
    }
  }

  const handleTabChange = async (event: React.SyntheticEvent, newValue: number) => {
    await _getImages(newValue === 0 ? 'system' : 'user');
    setActiveTab(newValue)
  };

  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    _getImages('system');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperComponent={PaperComponent}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
        {translate('image_library', language, config.locales)}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Tabs value={activeTab} onChange={handleTabChange} aria-label="tabs example" variant="fullWidth">
        <Tab label={translate('system_image', language, config.locales)} />
        <Tab label={translate('my_image', language, config.locales)} />
      </Tabs>

      <DialogContent dividers sx={{ height: '500px' }}>
        <MasonryImageList onChange={onChange} images={images} projectID={projectID} type={ activeTab === 0 ? 'system' : 'user' } />
      </DialogContent>
    </Dialog>
  );
};
