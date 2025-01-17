import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAttribute, IProjectAttribute } from 'src/types/project/project';

const initialState: IProjectAttribute = {
  attributes: {}, // The actual component attributes in the page code, eg: {'projectID1': { button_1: {} }}
  currentComponentAttr: {}, // the current selected component's attributes, eg: {'projectID1': {componentName: 'button', attributes: {text: 'hello'}}}
  attributesConfig: {}, // attributes config from toolbox components
  afterUpdateCurentComponentAttr: null, // TODO: delete it
  selectedComId: '',
  willInsertLocationComs: [],
};

export const attributesSlice = createSlice({
  name: 'attributes',
  initialState,
  reducers: {
    updateAttributes: (state: IProjectAttribute, action: PayloadAction<{ projectID: string, pageID: string, id: string, attributes: IAttribute }>) => {
      const { projectID, pageID, id, attributes } = action.payload;
      state.attributes[projectID] = state.attributes[projectID] || {};
      state.attributes[projectID][pageID] = state.attributes[projectID][pageID] || {};
      state.attributes[projectID][pageID][id] = attributes;
    },
    updateCurrentComponentAttribute: (
      state: IProjectAttribute,
      action: PayloadAction<{projectID: string, componentAttr: IAttribute|null}>
    ) => {
      const { projectID, componentAttr } = action.payload;
      state.currentComponentAttr[projectID] = componentAttr;
    },
    updateAfterUpdateCurentComponentAttr: (
      state: IProjectAttribute,
      action: PayloadAction<IAttribute|null>
    ) => {
      state.afterUpdateCurentComponentAttr = action.payload;
    },
    updateAttributesConfig: (
      state: IProjectAttribute,
      action: PayloadAction<{
        projectID: string,
        attributesConfig: Array<any>
      }>
    ) => {
      const { projectID, attributesConfig } = action.payload;
      state.attributesConfig[projectID] = attributesConfig;
    },
    updateSelectedComId: (state: IProjectAttribute, action: PayloadAction<string>) => {
      state.selectedComId = action.payload
    },
    updateWillInsertLocationComs: (state: IProjectAttribute, action: PayloadAction<IProjectAttribute['willInsertLocationComs']>) => {
      state.willInsertLocationComs = action.payload
    }
  },
});

export default attributesSlice.reducer;
export const { updateAttributes, updateCurrentComponentAttribute, updateWillInsertLocationComs, updateAttributesConfig, updateAfterUpdateCurentComponentAttr, updateSelectedComId } = attributesSlice.actions;
