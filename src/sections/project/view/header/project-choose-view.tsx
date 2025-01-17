'use client'

// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import DialogActions from '@mui/material/DialogActions';
// locale
import { useLocales } from 'src/locales';
// routes
import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hook';
// hooks
import useServerAction from 'src/hooks/use-server-action';
// components
import Iconify from 'src/components/iconify';
import { useEffect } from 'react';
// utils
import { fDate } from 'src/lib/client/utils/format-time';
//
import { getProjectList } from 'src/services/server-actions/project/client';

// ----------------------------------------------------------------------

export default function ProjectChooseDialogView({ closeDialog }: { closeDialog: () => void }) {
  const { t } = useLocales()
  const urlSearchParams = useSearchParams();
  const currentProjectID = Number(urlSearchParams.get('projectID'));
  const { isLoading, data, run } = useServerAction(getProjectList);
  const router = useRouter();
  
  const handlePageJump = (projectID: number) => {
    const pageUrl = paths.dashboard.project.root(projectID);
    
    closeDialog();
    
    // The project is not open in the current window
    if (!currentProjectID) {
      router.push(pageUrl)
      return
    }

    // Open a new window
    window.open(pageUrl, '_blank');
  }

  useEffect(() => {
    run();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Paper variant="outlined" sx={{ width: 1, marginBottom: '20px' }}>
      <List>
        {
          data && data.map(project => <ListItemButton key={project.id} onClick={() => handlePageJump(project.id)}>
            <ListItemAvatar>
              <Box component="img" src="/assets/icons/files/ic_folder.svg" sx={{ width: 30, height: 30 }} />
            </ListItemAvatar>
            <ListItemText primary={project.name} secondary={fDate(project.ctime)} />
          </ListItemButton>)
        }
      </List>
    </Paper>
}
