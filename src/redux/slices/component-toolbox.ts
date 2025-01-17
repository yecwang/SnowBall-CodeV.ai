import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ComStructure, IComponent, IComTreeStructure, IProjectToolbox } from 'src/types/project/project';

const initialState: IProjectToolbox = {
  toolBoxComponents: {},
  comTreeStructure: [],
  comStructure: {}
};

export const toolboxSlice = createSlice({
  name: 'toolbox',
  initialState,
  reducers: {
    updateComponents: (state: IProjectToolbox, action: PayloadAction<{ projectID: string, toolBoxComponents: { [key: string]: IComponent; } }>) => {
      const { projectID, toolBoxComponents } = action.payload
      state.toolBoxComponents[projectID] = toolBoxComponents;
    },
    updateComTreeStructure: (state: IProjectToolbox, action: PayloadAction<{ comTreeStructure: IComTreeStructure[], comStructure: ComStructure }>) => {
      const { comTreeStructure, comStructure } = action.payload
      state.comTreeStructure = comTreeStructure;
      state.comStructure = comStructure
    }

  },
});

export default toolboxSlice.reducer;
export const { updateComponents, updateComTreeStructure } = toolboxSlice.actions;
