'use client';

import React from 'react';
import {
  updateProjectInfo,
} from 'src/services/server-actions/project/client';
import useServerAction from 'src/hooks/use-server-action';
import { Project, DashboardOpenModal  } from 'src/types/project/project';

import i18n from 'i18next';
import {
  Typography,
  Box,
  Button,
  Paper,
  Modal,
} from '@mui/material';


interface LockedProps {
  project: Project;
  openModal: DashboardOpenModal;
  setOpenModal: (openModal: DashboardOpenModal) => void;
  setSelectedProject: (project: Project) => void;
}

const Locked: React.FC<LockedProps> = ({
  openModal,
  setOpenModal,
  project,
  setSelectedProject,
}) => {
  const { run: locked } = useServerAction(updateProjectInfo);
  const handleClose = () => {
    locked({ id: project.id, updateInfo: { isLocked: true } });
    setSelectedProject({
      ...project,
      isLocked: true,
    });
    setOpenModal({ ...openModal, locked: false });
  };
  return (
    <Modal open={openModal.locked} onClose={handleClose}>
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Paper sx={{ width: 400, padding: 3 }}>
          <Typography variant="h6" gutterBottom>
            {`${i18n.t('project.dashboard.locked_modal.title')}[${project.name}]`}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {i18n.t('project.dashboard.locked_modal.content')}
          </Typography>
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button variant="contained" color="inherit" onClick={handleClose}>
              {i18n.t('project.dashboard.locked_modal.cancel')}
            </Button>
            <Button variant="contained" color="primary" onClick={handleClose}>
              {i18n.t('project.dashboard.locked_modal.confirm')}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Modal>
  );
};
export default Locked;
