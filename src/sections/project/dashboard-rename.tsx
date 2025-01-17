'use client';

import React from 'react';
import { Project, DashboardOpenModal  } from 'src/types/project/project';
import {
  updateProjectInfo,
} from 'src/services/server-actions/project/client';
import useServerAction from 'src/hooks/use-server-action';

import i18n from 'i18next';
import {
  Typography,
  Box,
  Button,
  Paper,
  Modal,
  TextField,
} from '@mui/material';


interface RenameProps {
  openModal: DashboardOpenModal;
  setOpenModal: (openModal: DashboardOpenModal) => void;
  setSelectedProject: (project: Project) => void;
  project: Project;
}

const Rename: React.FC<RenameProps> = ({
  openModal,
  setOpenModal,
  setSelectedProject,
  project,
}) => {
  const { run: rename } = useServerAction(updateProjectInfo);
  const [name, setName] = React.useState(project.name);
  React.useEffect(() => {
    setName(project.name);
  }, [project])
  
  const handleRename = () => {
    rename({ id: project.id, updateInfo: { name } });
    setSelectedProject({
      ...project,
      name,
    });
    setOpenModal({ ...openModal, rename: false });
  };
  const handleClose = () => {
    setOpenModal({ ...openModal, rename: false });
  };

  return (
    <Modal open={openModal.rename} onClose={handleClose}>
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Paper sx={{ width: 400, padding: 3 }}>
          <Typography variant="h6" gutterBottom>
            {i18n.t('project.dashboard.rename_modal.title')}
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label={i18n.t('project.dashboard.rename_modal.name')}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button variant="contained" color="inherit" onClick={handleClose}>
              {i18n.t('project.dashboard.rename_modal.cancel')}
            </Button>
            <Button variant="contained" color="primary" onClick={handleRename}>
              {i18n.t('project.dashboard.rename_modal.confirm')}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Modal>
  );
};

export default Rename;
