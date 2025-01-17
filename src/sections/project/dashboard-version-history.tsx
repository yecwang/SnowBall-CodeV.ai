'use client';

import React from 'react';
// import useServerAction from 'src/hooks/use-server-action';
import { useSettingsContext } from 'src/components/settings';
import { HEADER } from 'src/layouts/config-layout';
import { Project, DashboardOpenModal  } from 'src/types/project/project';

import i18n from 'i18next';
import {
  Typography,
  Box,
  Button,
  Drawer,
  TableContainer,
  Table,
  TableRow,
  TableHead,
  TableCell,
  Paper,
  TableBody,
} from '@mui/material';


interface VersionHistoryProps {
  project: Project;
  setOpen: (open: DashboardOpenModal) => void;
  open: DashboardOpenModal;
}

interface Vision {
  version: string;
  status: string;
}

const VersionHistory: React.FC<VersionHistoryProps> = ({ project, setOpen, open }) => {
  const _getProjectVersion = (project: Project) => {
    // mock data
    const versions: Vision[] = [
      { version: 'V1.0', status: 'RELEASED_PROD' },
      { version: 'V1.1', status: 'RELEASED_TEST' },
      { version: 'V1.2', status: 'UNPUBLISHED' },
    ];
    return versions;
  };
  const statusColor: Record<string, string> = {
    RELEASED_PROD: 'green',
    RELEASED_TEST: 'orange',
    UNPUBLISHED: 'red',
  };
  const handleClose = () => {
    setOpen({ ...open, versionHistory: false });
  };
  const settings = useSettingsContext();
  const isNavHorizontal = settings.themeLayout === 'horizontal';
  const marginTop = isNavHorizontal ? HEADER.H_DESKTOP + HEADER.H_MOBILE : HEADER.H_DESKTOP;
  const currentProjectVersion = _getProjectVersion(project);
  return (
    <Drawer
      open={open.versionHistory}
      onClose={handleClose}
      anchor="right"
      hideBackdrop
      ModalProps={{
        keepMounted: false,
      }}
    >
      <Paper
        sx={{
          padding: 0,
          backgroundColor: 'rgba(251,251,251,1)',
          marginTop: `${marginTop}px`,
          width: '475px',
        }}
      >
        <Typography
          sx={{
            width: '475px',
            height: '60px',
            // line-height: 23px;
            lineHeight: '23px',
            overflow: 'hidden',
            backgroundColor: 'rgba(255,255,255,0.95)',
            alignItems: 'center',
            display: 'flex',
            paddingLeft: '20px',
            color: 'rgba(109, 114, 125, 1)',
            fontSize: '16px',
            textAlign: 'left',
            fontFamily: 'Roboto',
          }}
        >
          {project
            ? `[${project.name}] ${i18n.t('project.dashboard.version_modal.title')}`
            : i18n.t('project.dashboard.version_modal.title')}
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  width: '150px',
                  height: '55px',
                  lineHeight: '20px',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(251,251,251,1)',
                  color: 'rgba(109, 114, 125, 1)',
                  fontSize: '14px',
                  textAlign: 'center',
                  fontFamily: 'PingFang SC',
                }}
              >
                <TableCell>{i18n.t('project.dashboard.version_modal.number')}</TableCell>
                <TableCell>{i18n.t('project.dashboard.version_modal.status')}</TableCell>
                <TableCell>{i18n.t('project.dashboard.version_modal.option')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody
              sx={{
                width: '150px',
                height: '55px',
                lineHeight: '20px',
                borderRadius: '4px',
                backgroundColor: 'rgba(255,255,255,1)',
                color: 'rgba(109, 114, 125, 1)',
                fontSize: '13px',
                textAlign: 'center',
                fontFamily: 'Roboto',
              }}
            >
              {currentProjectVersion.map((version, index) => (
                <TableRow key={index}>
                  <TableCell>{version.version}</TableCell>
                  <TableCell style={{ color: statusColor[version.status] }}>
                    {i18n.t(`project.dashboard.version_status.${version.status}`)}
                  </TableCell>
                  <TableCell>
                    <Button color="primary">
                      {i18n.t('project.dashboard.version_modal.view')}
                    </Button>
                    <Button color="primary" disabled={version.status === 'RELEASED_PROD'}>
                      {i18n.t('project.dashboard.version_modal.recovered')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box display="flex" sx={{ position: 'fixed', bottom: 0, right: 0, margin: 2 }}>
          <Button
            variant="contained"
            onClick={handleClose}
            sx={{
              width: '430px',
              height: '50px',
              lineHeight: '20px',
              borderRadius: '4px',
              backgroundColor: 'rgba(245,245,245,1)',
              color: 'rgba(136,136,136,1)',
              fontSize: '16px',
              textAlign: 'center',
              fontFamily: 'Roboto',
              border: '1px solid rgba(238,247,255,1)',
            }}
          >
            {i18n.t('project.dashboard.version_modal.close')}
          </Button>
        </Box>
      </Paper>
    </Drawer>
  );
};

export default VersionHistory;
