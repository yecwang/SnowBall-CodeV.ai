import { useState } from 'react';
import { Button, Menu, MenuItem, Box } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { TAttributeEditProps } from '../common/type';
import AttributeImageLibDialog from './AttributeImageLibDialog';
import AttributeImageUploadDialog from './AttributeImageUploadDialog';
import { translate } from '../common/utils';
import { config } from './config';

type TProps = {
  projectID: string;
  uploadImage: (formData: FormData) => any;
  onChange: TAttributeEditProps['onChange'];
  src: string;
  getImages: TAttributeEditProps['getImages'];
  language: TAttributeEditProps['language'];
}
export default function AttributeImage({ projectID, uploadImage, onChange, src, getImages, language }: TProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isOpenUploadDialog, setIsOpenUploadDialog] = useState<boolean>(false);
  const [isOpenImageLib, setIsOpenImageLib] = useState<boolean>(false);
  const handleCloseUploadDialog = () => setIsOpenUploadDialog(false);

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box position="relative" display="inline-block">
        {/* eslint-disable-next-line */}
        <img src={src} alt="Selected Image" />

        <Box
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          bgcolor="rgba(0, 0, 0, 0.1)"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Button
            id="demo-customized-button"
            variant="contained"
            onClick={handleOpenMenu}
            endIcon={<KeyboardArrowDownIcon />}
            color="primary"
          >
            {translate('select_image', language, config.locales)}
          </Button>
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        slotProps={{ paper: { elevation: 0 } }}
      >
        <MenuItem onClick={() => setIsOpenUploadDialog(true)}>
          {translate('upload_from_local', language, config.locales)}
        </MenuItem>
        <MenuItem onClick={() => setIsOpenImageLib(true)}>
          {translate('image_library', language, config.locales)}
        </MenuItem>
      </Menu>

      <AttributeImageUploadDialog language={language} onChange={onChange} uploadImage={uploadImage} open={isOpenUploadDialog} projectID={projectID} onClose={handleCloseUploadDialog} />
      <AttributeImageLibDialog language={language} onChange={onChange} getImages={getImages} projectID={projectID}  open={isOpenImageLib} setOpen={setIsOpenImageLib} />
    </>
  );
}