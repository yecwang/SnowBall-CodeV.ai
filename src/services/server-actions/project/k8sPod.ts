'use server';

/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
// middleware
import withServerAction from 'src/lib/server/middware/with-server-action';
// constants
import * as ServerAction from 'src/constants/server-action';
// api
import * as simulatorController from 'src/lib/server/common/simulator-controller';

export const createPod = withServerAction('CREATE_POD', async (context, id: number) => {
  const volumeSubOptions = {
    containerName: 'vite-container',
    volumeName: 'vite-volume',
    subPath: id,
  };
  const podResult = await simulatorController.createPod('default', 'default', volumeSubOptions);

  const podData = podResult.data;

  console.log('Create Pod: ', podData);

  return podData;
});

export const runPod = withServerAction(
  ServerAction.RUN_POD,
  async (context, id: string, url: string) => {
    const urlResult = new URL(url);
    const command = [
      '/bin/bash',
      '-c',
      `BASE_PATH=${urlResult.pathname} yarn build && nginx -s reload`,
    ];
    console.log('Run Pod: ', command);
    const r = await simulatorController.executeCommandStream(id, command);
    console.log(r.data);
  }
);

export const getPodStatus = withServerAction(
  ServerAction.GET_POD_STATUS,
  async (context, id: string) => {
    const podResult = await simulatorController.getPodStatus(id);
    console.log('Pod Status: ', podResult.data);

    return {
      status: podResult.data.status,
      id,
    };
  }
);

export const deletePod = withServerAction(
  ServerAction.DELETE_POD,
  async (context, id: string, origin: string) => {
    console.debug(`[${ServerAction.DELETE_POD}] origin: ${origin}, podID`, id);
    await simulatorController.deletePod(id);
  }
);


