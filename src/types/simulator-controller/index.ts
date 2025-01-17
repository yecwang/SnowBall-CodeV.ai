export type TCreatePodData = {
  id: string;
  url: string;
}

export enum PodStatus {
  Ending = 'Ending',
  Running = 'Running',
  Succeeded = 'Succeeded',
  Failed = 'Failed',
  Unknown = 'Unknown',
}
