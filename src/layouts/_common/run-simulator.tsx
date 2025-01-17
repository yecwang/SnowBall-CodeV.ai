// @mui
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
// components
import Simulator from 'src/components/simulator';
// redux
import { useSelector, useDispatch } from 'src/redux/store';
import { RunSimulatorStatus, actions as runSimulatorActions } from 'src/redux/slices/run-simulator';
// hooks
import useServerAction from 'src/hooks/use-server-action';
import useLocales from 'src/locales/use-locales';
// actions
import * as projectActions from 'src/services/server-actions/project/client';
import React, { useEffect, useRef } from 'react';

const BoxCenter = ({ children }: { children: React.ReactNode }) => (
  <Box sx={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center' }}>{children}</Box>
);
const GradientCircularProgress = ({ message }: { message: string }) => (
  <BoxCenter>
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <svg width={0} height={0}>
        <defs>
          <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e01cd5" />
            <stop offset="100%" stopColor="#1CB5E0" />
          </linearGradient>
        </defs>
      </svg>
      <CircularProgress size={65} sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {message}
        </Typography>
      </Box>
    </Box>
  </BoxCenter>
)

export default function RunSimulator() {
  const _handleClose = async (origin: string) => {
    console.log(`delete pod with origin: ${origin}, podID ${podIDRef.current}`);
    if (podIDRef.current) {
      dispatch(runSimulatorActions.update({ status: RunSimulatorStatus.Closing }));
      await deletePod(podIDRef.current, origin);
    }

    dispatch(runSimulatorActions.reset());
  }

  const { t } = useLocales();
  const dispatch = useDispatch();
  const runSimulator = useSelector(store => store.runSimulator);
  const { run: deletePod } = useServerAction(projectActions.deletePod);
  const podIDRef = useRef(runSimulator.podID);

  useEffect(() => {
    console.log('update podID', runSimulator.podID);
    podIDRef.current = runSimulator.podID;
  }, [runSimulator.podID]);

  useEffect(() => {
    const beforeUnloadHandler = () => _handleClose('PAGE_UNLOAD');

    window.addEventListener('beforeunload', beforeUnloadHandler);

    return () => {
      _handleClose('COMPONENT_UNMOUNT');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Simulator open={runSimulator.isOpen}>
    {
      runSimulator.status === RunSimulatorStatus.Running && (
        <iframe src={runSimulator.url} style={{ width: '100%', height: '100%' }} title={t('header.run_simulation.title')} />
      )
    }
    {
      (runSimulator.status === RunSimulatorStatus.Starting || runSimulator.status === RunSimulatorStatus.Unstart) && (
        <GradientCircularProgress message={t('header.run_simulation.starting')} />
      )
    }
    {
      (runSimulator.status === RunSimulatorStatus.Closing) && (
        <GradientCircularProgress message={t('header.run_simulation.closing')} />
      )
    }
    {
      runSimulator.status === RunSimulatorStatus.Failed && (
        <BoxCenter><Alert sx={{ mx: '5px' }} severity="error">{t('header.run_simulation.failed_tip')}</Alert></BoxCenter>
      )
    }
  </Simulator>;
}
