'use server';

import path from 'node:path';
// middleware
import withServerAction from 'src/lib/server/middware/with-server-action';
import { TSetting } from 'src/pluginapp-context-manager/types';
// constants
import * as ServerAction from 'src/constants/server-action';
//
import * as projectModel from 'src/services/models/project/project';
import { readFileConvertToObj } from 'src/lib/server/common/file';

export const getSetting = withServerAction(ServerAction.GET_SETTING, async (context, projectID: number) => {
  const projectInfo = await projectModel.getProjectInfo(projectID);
  const projectPath = projectInfo.path as string;

  const { settingBasePath } = await projectModel.prepareProjectSourceDir(projectPath);
  const settingPath = path.join(settingBasePath, `index.json`);

  return readFileConvertToObj<TSetting>(settingPath);
});
