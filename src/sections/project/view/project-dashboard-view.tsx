'use client';

import React from 'react';
import moment from 'moment';
import { paths } from 'src/routes/paths';
import {
  getProjectList,
  getSetting,
} from 'src/services/server-actions/project/client';
import { Project, DashboardOpenModal  } from 'src/types/project/project';

import useServerAction from 'src/hooks/use-server-action';
import { useSettingsContext } from 'src/components/settings';
import i18n from 'i18next';
import Iconify from 'src/components/iconify';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardHeader,
  CardContent,
  Menu,
  MenuItem,
  IconButton,
  CircularProgress,
} from '@mui/material';
import CreateProject from '../dashboard-create';
import VersionHistory from '../dashboard-version-history';
import Rename from '../dashboard-rename';
import Locked from '../dashboard-locked';

interface ProjectCardProp {
  project: Project;
  setSelectedProject: (project: Project) => void;
  selectedProject: Project | null;
}

const ProjectCard = ({ project, setSelectedProject, selectedProject }: ProjectCardProp) => {
  const statusCss = {
    CREATED: {
      processColor: '#D0DFF2',
      fontColor: 'primary.light',
      icon: 'emojione-monotone:new-button',
      process: 25
    },
    DESIGNING: {
      processColor: '#F7EDDC',
      fontColor: 'warning.main',
      icon: 'fluent:laptop-settings-24-filled',
      process: 75
    },
    RELEASED: {
      processColor: '#D6F2C0',
      fontColor: 'success.main',
      icon: 'material-symbols:new-releases',
      process: 100
    },
  };
  const theme = useTheme()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openModal, setOpenModal] = React.useState<DashboardOpenModal>({
    versionHistory: false,
    rename: false,
    locked: false,
  });
  const openMenu = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (action: keyof DashboardOpenModal) => {
    setSelectedProject(project);
    setAnchorEl(null);
    openModal[action] = true;
    setOpenModal({ ...openModal });
  };
  const currentStatusCss = statusCss[project.status];
  const { run: getSettingInfo } = useServerAction(getSetting);
  const _handlePageJump = async (projectID: number) => {
    const { data } = await getSettingInfo(projectID);
    if (data) {
      window.open(paths.project.design(projectID).pageItem(data.entryPage), '_self');
    }
  }

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: 400,
        height: 350,
      }}
    >
      <CardHeader
        action={
          <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={openMenu ? 'long-menu' : undefined}
            aria-expanded={openMenu ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleClick}
          >
            <Iconify icon="ri:more-2-line" textAlign="right" />
          </IconButton>
        }
        title={project.name}
        // title居中显示
        sx={{
          textAlign: 'center',
          padding: '10px',
          width: '100%',
        }}
      />
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={(_) => handleClose('view')}>
          {i18n.t('project.dashboard.view')}
        </MenuItem>
        <MenuItem onClick={(_) => handleClose('edit')}>
          {i18n.t('project.dashboard.edit')}
        </MenuItem>
        <MenuItem onClick={(_) => handleClose('locked')}>
          {i18n.t('project.dashboard.locked')}
        </MenuItem>
        <MenuItem onClick={(_) => handleClose('versionHistory')}>
          {i18n.t('project.dashboard.versionHistory')}
        </MenuItem>
        <MenuItem onClick={(_) => handleClose('rename')}>
          {i18n.t('project.dashboard.rename')}
        </MenuItem>
        <MenuItem onClick={(_) => handleClose('export')}>
          {i18n.t('project.dashboard.export')}
        </MenuItem>
      </Menu>
      <CardContent
        onClick={(_) => _handlePageJump(project.id)}
        sx={{
          flexGrow: 1,
          padding: 0,
          margin: 0,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        }}
      >
          <Box display="flex" justifyContent="center" alignItems="center">
            <Typography
              sx={{
                backgroundColor: 'primary.main',
                borderRadius: '20px',
                fontSize: '16px',
                color: '#FFFFFF',
                width: '65px',
                height: '25px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              V1.0
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{
                px: '10px',
                fontSize: '16px',
                color: theme.palette.primary.light,
              }}
            >
              {project.status === 'CREATED'
                ? `${i18n.t('project.dashboard.create_time')}: ${moment(project.ctime).format(
                    'YYYY-MM-DD HH:mm'
                  )}`
                : `${i18n.t('project.dashboard.update_time')}: ${moment(project.utime).format(
                    'YYYY-MM-DD HH:mm'
                  )}`}
            </Typography>
          </Box>
          <Box position="relative" display="inline-flex" sx={{width: '200px', height: '200px', marginTop: '5px'}}>
            <Box
              top={0}
              left={0}
              bottom={0}
              right={0}
              position="absolute"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <CircularProgress variant="determinate" size={200} value={currentStatusCss.process} sx={{color: currentStatusCss.processColor, circle: { strokeLinecap: 'round' }}} />
            </Box>
            <Box
              top={0}
              left={0}
              bottom={0}
              right={0}
              position="absolute"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Typography
                sx={{
                  textAlign: 'center',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: currentStatusCss.fontColor,
                }}
              >
                {i18n.t(`project.status.${project.status}`)}
              </Typography>
            </Box>
          </Box>
          <Box
            position="absolute"
            bottom={30}
            right={30}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Iconify icon={currentStatusCss.icon} width={55} color={theme.palette.primary.lighter} />
          </Box>
      </CardContent>
      {selectedProject && (
        <>
          <VersionHistory project={selectedProject} open={openModal} setOpen={setOpenModal} />
          <Rename
            openModal={openModal}
            setOpenModal={setOpenModal}
            setSelectedProject={setSelectedProject}
            project={selectedProject}
          />
          <Locked
            project={selectedProject}
            openModal={openModal}
            setOpenModal={setOpenModal}
            setSelectedProject={setSelectedProject}
          />
        </>
      )}
    </Card>
  );
};


const Dashboard: React.FC = () => {
  const theme = useTheme();
  const settings = useSettingsContext();
  const [newModalOpen, setNewModalOpen] = React.useState(false);
  const [selectedProject, setSelectedProject] = React.useState<Project | null>(null);
  const { data: projects, run } = useServerAction(getProjectList);

  const handleNewModalOpen = () => {
    setNewModalOpen(true);
  };

  React.useEffect(() => {
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Container
      maxWidth={settings.themeStretch ? false : 'xl'}
    >
      <Typography
        variant="h3"
        sx={{
          marginTop: '30px',
          marginBottom: '30px'
        }}
      >
        {i18n.t('project.welcome')}
      </Typography>
      <Box
        onClick={handleNewModalOpen}
        sx={{
          width: '300px',
          height: '260px',
          fontSize: '24px',
          fontWeight: 'bold',
          borderRadius: '20px',
          border: `5px dashed ${theme.palette.primary.lighter}`,
          backgroundColor: theme.palette.background.paper,
          padding: '15px',
          color: theme.palette.text.primary,
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          '&:hover': {
            color: theme.palette.primary.main,
            borderColor: theme.palette.primary.main,
            '& svg': {
              color: theme.palette.primary.main,
            },
          },
        }}
      >
        {i18n.t('project.create')}
        <Box sx={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <Iconify icon="grommet-icons:add" width={110} color={theme.palette.primary.lighter}  />
        </Box>
      </Box>
      <Typography
        sx={{
          marginTop: '30px',
          marginBottom: '30px',
          fontSize: '26px',
          fontWeight: 'bold',
          color: theme.palette.text.secondary,
        }}
      >
        {i18n.t('project.list')}
      </Typography>
      <Grid container spacing={3} style={{ borderTop: `2px dashed ${theme.palette.primary.lighter}`, paddingTop: '5px' }}>
        {projects &&
          // @ts-ignore
          projects.map((project: Project, index: number) => (
            <Grid item key={index}>
              <ProjectCard
                project={project}
                setSelectedProject={setSelectedProject}
                selectedProject={selectedProject}
              />
            </Grid>
          ))}
      </Grid>
      <CreateProject open={newModalOpen} getProjectList={run} setNewModalOpen={setNewModalOpen} />
    </Container>
  );
};
export default Dashboard;
