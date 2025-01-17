// utils
import { simulatorControllerIns } from 'src/lib/server/utils/axios';
// types
import { PodStatus, TCreatePodData } from 'src/types/simulator-controller';
// config
import { SIMULATOR_CONTROLLER_NAMESPACE } from 'src/services/config';

// ----------------------------------------------------------------------

export async function createPod(ns: string, templateID: string, volumeSubOptions: object) {
  return simulatorControllerIns.post<TCreatePodData>('/pods/', { ns, templateID, volumeSubOptions});
}

export async function executeCommand(id: string, commands: string[][]) {
  return simulatorControllerIns.patch(`/pods/${id}/execute`, { commands }, {
    params: { namespace : SIMULATOR_CONTROLLER_NAMESPACE }
  });
}

export async function executeCommandStream(id: string, command: string[]) {
  return simulatorControllerIns.patch(`/pods/${id}/execute/stream`, { command }, {
    params: { namespace : SIMULATOR_CONTROLLER_NAMESPACE }
  });
}

export async function deletePod(id: string) {
  return simulatorControllerIns.delete(`/pods/${id}`, {
    params: { namespace : SIMULATOR_CONTROLLER_NAMESPACE }
  });
}

export async function getPodStatus(id: string) {
  return simulatorControllerIns.get<{ status: PodStatus }>(`/pods/${id}/status`, {
    params: { namespace : SIMULATOR_CONTROLLER_NAMESPACE }
  });
}
