// @mui
import Alert from "@mui/material/Alert";
import LoadingButton from '@mui/lab/LoadingButton';
// components
import { ConfirmDialog } from "src/components/custom-dialog";
// redux
import { useDispatch, useSelector } from 'src/redux/store';
import { setProject } from 'src/redux/slices/project';
import { updateNavDialog } from "src/redux/slices/nav-dialog";
// server action
import * as projectActions from 'src/services/server-actions/project/client';
// hooks
import { useParams } from "src/routes/hook";
import useServerAction from "src/hooks/use-server-action";
import { useLocales } from "src/locales";

export default function DeletePageDialog() {
  const _handleClose = () => dispatch(updateNavDialog({ isOpen: false, operation: '' }));
  const _confirmDeletePage = async () => {
    await deletePageInFile({ projectID, pageID: pageID as string });
    const projectInfo = await loadProject(String(projectID))
    if (projectInfo.data) {
      dispatch(setProject(projectInfo.data))
    }
    _handleClose();
  }

  const { pageID, isOpen } = useSelector(store => store.navDialog);
  const dispatch = useDispatch();
  const { t } = useLocales()
  const params = useParams();
  const projectID = Number(params.projectID);
  const project = useSelector(store => store.project[projectID]);
  const { run: loadProject } = useServerAction(projectActions.loadProject);
  const { run: deletePageInFile, isLoading } = useServerAction(projectActions.deletePage);
  const isEntryPage = project.setting.entryPage === pageID;

  const _renderDialogContent = () => {
    if (isEntryPage) {
      return <Alert severity="warning">{t('pages.portal_page_cannot_deleted')}</Alert>;
    }

    return t('common.are_you_sure_delete');
  }

  return <ConfirmDialog
    open={isOpen}
    onClose={_handleClose}
    title={t('project.pages.menu.delete')}
    content={_renderDialogContent()}
    action={
      <LoadingButton variant="contained" loading={isLoading} disabled={isEntryPage} color="error" onClick={_confirmDeletePage}>
        {t('project.pages.menu.delete')}
      </LoadingButton>
    }
  />
}
