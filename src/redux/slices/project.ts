import _ from 'lodash'
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AppContext from 'src/pluginapp-context-manager/app-context';
import * as VariablesParser from 'src/pluginapp-context-manager/parser/variable-parser'
import { TFunction, TProject, TProjectPages,  TSetting, TVariable } from 'src/pluginapp-context-manager/types';
// ----------------------------------------------------------------------

type TProjectStore = {
  [key: string|number]: TProject
}
const initialState: TProjectStore = {};

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProject: (state: TProjectStore, action: PayloadAction<TProject>) => {
      const { id, name, description, setting, pages, functions, variables, metadata, texts } = action.payload
      if (!id) {
        return
      }
      const variableList: Array<TVariable> = VariablesParser.parse(variables)
      const _addRunComponentCommand = (pages: TProjectPages) => {
        for (const key in pages) {
          if (typeof pages[key] === 'string') {
            const pageContent = pages[key] as string;
            pages[key] = pageContent.replace('export default ', '')
            if (!pageContent.endsWith('<Page />;')) {
              pages[key] += `\n <Page />;`
            }
          } else {
            _addRunComponentCommand(pages[key] as TProjectPages)
          }
        }
      }
      _addRunComponentCommand(pages);
      // converted pages
      // Object.keys(pages).forEach(item => {
      //   if (typeof pages[item] === 'string') {
      //     convertedPages[item] = pages[item].replace('export default ', '')
      //     if (!convertedPages[item].endsWith('<Page />;')) {
      //       convertedPages[item] += `\n <Page />;`
      //     }
      //   }
      // })
      state[id] = {
        ...state[id],
        id,
        name,
        description,
        setting,
        pages,
        functions,
        variables: variableList,
        metadata,
        texts,
      }

      AppContext.project[id as keyof typeof AppContext.project] = {
        // @ts-ignore
        setting,
        pages,
        functions,
        variables,
        metadata,
        texts,
      }
    },
    setSetting: (state: TProjectStore, action: PayloadAction<{projectID: number, setting: TSetting}>) => {
      const { projectID, setting } = action.payload
      state[projectID].setting = setting
      // @ts-ignore
      AppContext.project[projectID as keyof typeof AppContext.project].setting = setting
    },
    setPage: (state: TProjectStore, action: PayloadAction<{projectID: number, pages: TProjectPages}>)=>{
      const { projectID, pages } = action.payload
      state[projectID].pages = pages
      AppContext.project[projectID as keyof typeof AppContext.project].pages = pages
    },
    updatePageCode: (state: TProjectStore, action: PayloadAction<{projectID: number, pageID: string|null, code: string}>)=>{
      // eslint-disable-next-line consistent-return
      const _findAndUpdatePageCode = () => {
        const pageConfig = state[projectID as keyof typeof state].setting.pages[pageID || ''];
        if (!pageConfig?.path) {
          return '';
        }

        const paths = pageConfig.path.split('/');
        let current =  newPages;
        for (const key of paths) {
          if (key === pageID) {
            current[key] = code;
            break;
          }
          current = current[key] as TProjectPages;
        }
      }

      const { projectID, pageID, code } = action.payload
      if (!state[projectID] || !pageID) {
        console.error(`Invalid projectID: ${projectID} or pageID: ${pageID}`)
        return;
      }

      const newPages = _.cloneDeep(state[projectID as keyof typeof state].pages)
      _findAndUpdatePageCode()
      state[projectID].pages = newPages
      AppContext.project[projectID as keyof typeof AppContext.project].pages = newPages
    },
    setVariables: (state: TProjectStore, action: PayloadAction<{projectID: number, variables: any}>)=>{
      const { projectID, variables } = action.payload
      state[projectID] = state[projectID] || {}
      state[projectID].variables = variables
      AppContext.project[projectID as keyof typeof AppContext.project].variables = variables
    },
    setMetadata: (state: TProjectStore, action: PayloadAction<{projectID: number, metadata: any}>)=>{
      const { projectID, metadata } = action.payload
      state[projectID].metadata = metadata
      AppContext.project[projectID as keyof typeof AppContext.project].metadata = metadata
    },
    setTexts: (state: TProjectStore, action: PayloadAction<{projectID: number, texts: any}>)=>{
      const { projectID, texts } = action.payload
      state[projectID].texts = texts
      AppContext.project[projectID as keyof typeof AppContext.project].texts = texts
    },
    setFunctions: (state: TProjectStore, action: PayloadAction<{projectID: number, functions: TFunction[]}>)=>{
      const { projectID, functions } = action.payload
      state[projectID].functions = functions
      AppContext.project[projectID as keyof typeof AppContext.project].functions = functions
    },
  },
});

export default projectSlice.reducer;
export const { setProject, setPage, updatePageCode, setSetting, setFunctions, setMetadata, setVariables, setTexts } = projectSlice.actions;
