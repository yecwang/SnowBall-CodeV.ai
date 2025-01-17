import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';


// hooks
import useServerAction from 'src/hooks/use-server-action';

// redux
import { RootState } from 'src/redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { RunSimulatorStatus, actions as runSimulatorActions } from 'src/redux/slices/run-simulator';
// server action
import * as projectActions from 'src/services/server-actions/project/client';
import { PodStatus } from 'src/types/simulator-controller';
import * as VariablesParser from 'src/pluginapp-context-manager/parser/variable-parser'
import { useSnackbar } from 'src/components/snackbar';
import { useLocales } from 'src/locales';

// routes
import { paths } from 'src/routes/paths';
import { PageConfigType, TProjectPages } from 'src/pluginapp-context-manager/types';
import _ from 'lodash';

// ----------------------------------------------------------------------

export default function useHeaderToolbar() {
  const projectID = useParams().projectID as string;
  
  const project = useSelector((state: RootState) => state.project);
  const runSimulator = useSelector((state: RootState) => state.runSimulator);
  const [undoDisabled, setUndoDisabled] = useState<Boolean>(true);
  const [redoDisabled, setRedoDisabled] = useState<Boolean>(true);
  
  const { t } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const router = useRouter();
  const { run: createPod } = useServerAction(projectActions.createPod);
  const { run: runPod } = useServerAction(projectActions.runPod);
  const { run: getPodStatus } = useServerAction(projectActions.getPodStatus);
  const { run: updateProject } = useServerAction(projectActions.updateProject);
  const podStatusRef = useRef(runSimulator.status);

  useEffect(() => { podStatusRef.current = runSimulator.status }, [runSimulator.status]);

  const _saveProject = useCallback(async (needResponseTip=true) => {
    console.log("projectID: ", projectID)
    console.log("project: ", project)
    if (!projectID || !project[projectID]) {
      enqueueSnackbar(t('common.project_not_ready'), { variant: 'error' });
      return
    }
    // TODO: show save model view before logic;
    const { pages, variables, setting } = project[projectID]

    const _convertedPages = (pages: TProjectPages) => {
      for (const pageID of Object.keys(pages)) {
        if (setting.pages[pageID].type === PageConfigType.Directory) {
          if (!Object.keys(pages[pageID])) {
            continue;
          }
          _convertedPages(pages[pageID] as TProjectPages)
          continue;
        }
        pages[pageID] = (pages[pageID] as string).replace('<Page />;', '').replace('<Page />', '').replace('function Page() ', 'export default function Page() ')
      }
      return pages
    }
    const convertedPages: TProjectPages = _convertedPages(_.cloneDeep(pages));
    const variablesCodes = VariablesParser.generateCode(variables)

    await updateProject({
      ...project[projectID],
      pages: convertedPages,
      variables: variablesCodes
    })
    console.log('project saved');
    if (needResponseTip) {
      enqueueSnackbar(t('project_design.header_toolbar.saved_success'), { variant: 'success' });
    }
  }, [projectID, project, updateProject, enqueueSnackbar, t])
  const _runProject = async () => {
    dispatch(runSimulatorActions.update({ status: RunSimulatorStatus.Starting, isOpen: true }));

    try {
      console.log('simulator status -->', podStatusRef.current, runSimulator);
      if (runSimulator.podID) {
        const { error } = await runPod(runSimulator.podID, runSimulator.url);
        if (error) {
          throw new Error('Failed to run simulator pod');
        }

        dispatch(runSimulatorActions.update({ status: RunSimulatorStatus.Running }));
        return;
      }

      const { data, error } = await createPod(Number(projectID));
      if (error || !data) {
        throw new Error('Failed to run simulator pod');
      }

      const podID = data.id;
      dispatch(runSimulatorActions.update({ podID, url: data.url }));

      const timer = setInterval(async () => {
        const { data: podStatusInfo, error } = await getPodStatus(podID);
        if (!podStatusInfo || error) {
          clearInterval(timer);
          throw new Error('Failed to run simulator pod');
        }
        
        if (podStatusInfo.status === PodStatus.Running) {
          clearInterval(timer);
          const { error } = await runPod(podID, data.url);
          if (error) {
            throw new Error('Failed to run simulator pod');
          }

          console.log('simulator status in setInterval -->', podStatusRef.current, runSimulator.status);
          
          if (podStatusRef.current === RunSimulatorStatus.Starting) {
            dispatch(runSimulatorActions.update({ status: RunSimulatorStatus.Running }));
          }
        }

        if (podStatusInfo.status === PodStatus.Failed || podStatusInfo.status === PodStatus.Unknown) {
          clearInterval(timer);
          dispatch(runSimulatorActions.update({ status: RunSimulatorStatus.Failed }));
        }
      }, 1000);
    } catch (error) {
      dispatch(runSimulatorActions.update({ status: RunSimulatorStatus.Failed }));
    }
  }
  
  
  const onQuitClick = useCallback(() => {
    _saveProject();
    router.push(paths.project.root)
  }, [router, _saveProject])
  const onSaveClick = useCallback(() => {
    _saveProject()
  }, [_saveProject])
  const onExportClick = useCallback(() => {
    // TODO: export
    console.log('export');
    enqueueSnackbar(t('common.unsupported_feature'), { variant: 'error' });
  }, [enqueueSnackbar, t])
  const onUndoClick = useCallback(() => {
    // TODO: on undo
    console.log('undo');
    enqueueSnackbar(t('common.unsupported_feature'), { variant: 'error' });
  }, [enqueueSnackbar, t])
  const onRedoClick = useCallback(() => {
    // TODO: on redo
    console.log('redo');
    enqueueSnackbar(t('common.unsupported_feature'), { variant: 'error' });
  }, [enqueueSnackbar, t])
  const onFullscreenClick = useCallback(() => {
    // TODO: on fullscreen
    console.log('fullscreen');
    enqueueSnackbar(t('common.unsupported_feature'), { variant: 'error' });
  }, [enqueueSnackbar, t])
  const onLanguageClick = useCallback(() => {
    // TODO: on language
    console.log('language');
    enqueueSnackbar(t('common.unsupported_feature'), { variant: 'error' });
  }, [enqueueSnackbar, t])
  const onVerifyClick = useCallback(() => {
    // TODO: on verify
    console.log('verify');
    enqueueSnackbar(t('common.unsupported_feature'), { variant: 'error' });
  }, [enqueueSnackbar, t])
  const onRunClick = useCallback(() => {
    _saveProject().then(() => {
      console.log('run project', paths.preview(Number(projectID)));
      window.open(paths.preview(Number(projectID)), '_blank');
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_saveProject])
  const onPublishClick = useCallback(() => {
    // TODO: on publish
    console.log('publish')
    enqueueSnackbar(t('common.unsupported_feature'), { variant: 'error' });
  }, [enqueueSnackbar, t])
  const onRefreshClick = useCallback(() => {
    _runProject()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return {
    onQuitClick,
    onSaveClick,
    onExportClick,
    onUndoClick,
    onRedoClick,
    onFullscreenClick,
    onLanguageClick,
    onVerifyClick,
    onRunClick,
    onPublishClick,
    undoDisabled,
    redoDisabled,
    onRefreshClick,
  };
}
