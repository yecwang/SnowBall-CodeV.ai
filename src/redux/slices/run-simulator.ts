import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type TRunSimulator = {
  isOpen: boolean;
  url: string;
  status: RunSimulatorStatus;
  podID: string;
}
export enum RunSimulatorStatus {
  Unstart = 'Unstart',
  Starting = 'Starting',
  Running = 'Running',
  Closing = 'Closing',
  End = 'End',
  Failed = 'Failed',
}
const initialState: TRunSimulator = {
  isOpen: false,
  url: '',
  status: RunSimulatorStatus.Unstart,
  podID: '',
};

export const attributesSlice = createSlice({
  name: 'run-simulator',
  initialState,
  reducers: {
    update: (state, action: PayloadAction<Partial<TRunSimulator>>) => {
      console.log('state...', {
        ...state,
        ...action.payload,
      });
      
      return {
        ...state,
        ...action.payload,
      }
    },
    reset: () => initialState,
  },
});

export default attributesSlice.reducer;

export const { actions } = attributesSlice;
