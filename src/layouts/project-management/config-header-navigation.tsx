import React, { useEffect, useMemo, useRef, useState } from 'react';
// locales
import { useLocales } from 'src/locales';
// components
import Iconify from 'src/components/iconify';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useSearchParams } from 'next/navigation';
import useServerAction from 'src/hooks/use-server-action';
// redux
import { useSelector, useDispatch } from 'src/redux/store';
import { RunSimulatorStatus, actions as runSimulatorActions } from 'src/redux/slices/run-simulator';
// server action
import * as projectActions from 'src/services/server-actions/project/client';
import { PodStatus } from 'src/types/simulator-controller';
import * as VariablesParser from 'src/pluginapp-context-manager/parser/variable-parser'

// ----------------------------------------------------------------------

export function useNavData() {
  const _saveProject = async () => {
    if (!projectID) {
      return
    }
    const { pages, variables } = project[projectID]
    const convertedPages: any = {}
    Object.keys(pages).forEach(item=>{
      const pageContent = pages[item]
      if (typeof pageContent === 'string') {
        convertedPages[item] = pageContent.replace('<Page />;', '').replace('<Page />', '').replace('function Page() ', 'export default function Page() ')
      } else {
        convertedPages[item] = pageContent
      }
    })
    const variablesCodes = VariablesParser.generateCode(variables)

    await updateProject({
      ...project[projectID],
      pages: convertedPages,
      variables: variablesCodes
    })
  }
  const _runProject = async () => {
    dispatch(runSimulatorActions.update({ status: RunSimulatorStatus.Starting, isOpen: true }));

    try {
      await _saveProject();

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

  const urlSearchParams = useSearchParams();
  const projectID = urlSearchParams.get('projectID');
  const project = useSelector((state) => state.project);
  const runSimulator = useSelector((state) => state.runSimulator);

  const { t } = useLocales();
  const dialog = useBoolean();
  const [dialogTitle, setDialogTitle] = useState('');
  const [operation, setOperation] = useState('');
  const dispatch = useDispatch();
  const { run: createPod } = useServerAction(projectActions.createPod);
  const { run: runPod } = useServerAction(projectActions.runPod);
  const { run: getPodStatus } = useServerAction(projectActions.getPodStatus);
  const { run: updateProject } = useServerAction(projectActions.updateProject);
  const podStatusRef = useRef(runSimulator.status);

  useEffect(() => { podStatusRef.current = runSimulator.status }, [runSimulator.status]);

  const data = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: 'HeaderNav',
        items: [
          {
            title: t('header.project.menu_title'),
            path: 'none',
            icon: <Iconify icon="heroicons-solid:template" />,
            children: [
              {
                title: t('header.project.create'),
                path: '#',
                onClick: () => {
                  dialog.onTrue();
                  setDialogTitle(t('header.project.create'));
                  setOperation('PROJECT_CREATE');
                }
              },
              {
                title: t('header.project.open'),
                path: '#',
                onClick: () => {
                  dialog.onTrue();
                  setDialogTitle(t('header.project.open'));
                  setOperation('PROJECT_CHOOSE');
                }
              },
            ]
          },
          {
            title: t('header.developerment.menu_title'),
            path: 'none',
            icon: <Iconify icon="heroicons-solid:template" />,
            children: [
              {
                title: t('header.developerment.save'),
                path: '#',
                onClick: _saveProject
              },
              {
                title: t('header.developerment.run'),
                path: '#',
                onClick: _runProject
              }
            ]
          },
        ],
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, dialog]
  );

  return {
    data,
    dialog,
    dialogTitle,
    operation,
  };
}