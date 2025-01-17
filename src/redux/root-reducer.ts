import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
// slices
import projectToolboxReducer from './slices/component-toolbox';
import projectAttributesReducer from './slices/attribute-editor';
import projectReducer from './slices/project';
import runSimulatorReducer from './slices/run-simulator';
import menuNavReducer from './slices/menu-nav';
import navDialogReducer from './slices/nav-dialog';

// ----------------------------------------------------------------------

export const createNoopStorage = () => ({
  getItem(_key: string) {
    return Promise.resolve(null);
  },
  setItem(_key: string, value: any) {
    return Promise.resolve(value);
  },
  removeItem(_key: string) {
    return Promise.resolve();
  },
});

export const storage =
  typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage();

const appBuiderToolboxPersistConfig = {
  key: 'projectToolbox',
  storage,
  keyPrefix: 'redux-',
};

export const rootReducer = combineReducers({
  projectToolbox: persistReducer(appBuiderToolboxPersistConfig, projectToolboxReducer),
  projectAttributes: projectAttributesReducer,
  project: projectReducer,
  runSimulator: runSimulatorReducer,
  menuNav: menuNavReducer,
  navDialog: navDialogReducer,
});
