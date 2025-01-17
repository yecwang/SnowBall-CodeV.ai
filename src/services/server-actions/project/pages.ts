'use server';

import fsPromises from 'node:fs/promises';
import path from 'node:path';
// middleware
import withServerAction from 'src/lib/server/middware/with-server-action';
import { PageConfigType, TPageConfig, TPagesConfig, TSetting } from 'src/pluginapp-context-manager/types';
import { ServerActionError } from 'src/lib/server/error';
// constants
import * as ServerAction from 'src/constants/server-action';
import * as ErrorCode from 'src/constants/error-code';
//
import * as projectModel from 'src/services/models/project/project';
import { readFileConvertToObj } from 'src/lib/server/common/file';

type TAddPage = {
  pageID: string;
  pageConfig: TPageConfig;
  pageCode: string;
  pageType: PageConfigType;
  projectID: number;
}
export const addPage = withServerAction(ServerAction.ADD_PAGE, async (context, body: TAddPage) => {
  const _updatePage = async () => {
    if (pageType === PageConfigType.Page) {
      const pageCodePath = path.join(pagesBasePath, `${pageConfig.path}.jsx`);

      const stat = await fsPromises.stat(pageCodePath).catch(err => err.code === 'ENOENT' ? null : err);
      if (stat) {
        throw new ServerActionError(ErrorCode.RESOURCE_ALREADY_EXISTS);
      }

      await fsPromises.writeFile(pageCodePath, pageCode);
      return;
    }

    if (pageType === PageConfigType.Directory) {
      const filepath = path.join(pagesBasePath, pageConfig.path);

      const stat = await fsPromises.stat(filepath).catch(err => err.code === 'ENOENT' ? null : err);
      if (stat) {
        throw new ServerActionError(ErrorCode.RESOURCE_ALREADY_EXISTS);
      }

      await fsPromises.mkdir(filepath);
    }
  }
  const _updateSetting = async () => {
    const settingPagesPath = path.join(settingBasePath, `index.json`);
    const settingConfig = await readFileConvertToObj<TSetting>(settingPagesPath);
    settingConfig.pages[pageID] = pageConfig;
    await fsPromises.writeFile(settingPagesPath, JSON.stringify(settingConfig));
  }

  const { pageID, pageConfig, pageCode, pageType, projectID } = body;
  const projectInfo = await projectModel.getProjectInfo(projectID);
  const projectPath = projectInfo.path as string;

  const { pagesBasePath, settingBasePath } = await projectModel.prepareProjectSourceDir(projectPath);

  await _updatePage();
  await _updateSetting();
});

export const updatePageName = withServerAction(ServerAction.UPDATE_PAGE_NAME, async (context, body: { projectID: number; pageID: string; name: string }) => {
  const { projectID, pageID, name } = body;
  const projectInfo = await projectModel.getProjectInfo(projectID);
  const projectPath = projectInfo.path as string;

  const { settingBasePath } = await projectModel.prepareProjectSourceDir(projectPath);

  const settingPagesPath = path.join(settingBasePath, `index.json`);
  const settingConfig = await readFileConvertToObj<TSetting>(settingPagesPath);
  settingConfig.pages[pageID].name = name;
  await fsPromises.writeFile(settingPagesPath, JSON.stringify(settingConfig));
});

export const deletePage = withServerAction(ServerAction.DELETE_PAGE, async (context, body: { projectID: number; pageID: string }) => {
  const _findFileIDs = async (filepath: string, results: string[] = []) => {
    const files = await fsPromises.readdir(filepath, { withFileTypes: true });
    for (const file of files) {
      if (file.isDirectory()) {
        results.push(file.name);
        // eslint-disable-next-line no-await-in-loop
        await _findFileIDs(path.join(filepath, file.name));
      } else {
        results.push(file.name.replace('.jsx', ''));
      }
    }

    return results;
  }

  const { projectID, pageID } = body;
  const projectInfo = await projectModel.getProjectInfo(projectID);
  const projectPath = projectInfo.path as string;
  const { pagesBasePath, settingBasePath } = await projectModel.prepareProjectSourceDir(projectPath);

  const settingPagesPath = path.join(settingBasePath, `index.json`);
  const settingConfig = await readFileConvertToObj<TSetting>(settingPagesPath);
  const pagesConfig = settingConfig.pages;
  const pageConfig = pagesConfig[pageID];
  const deletePagesPath = path.join(pagesBasePath, pageConfig.path);

  if (pageConfig.type === PageConfigType.Page) {
    await fsPromises.rm(`${deletePagesPath}.jsx`);
    delete pagesConfig[pageID];
  } else if (pageConfig.type === PageConfigType.Directory) {
    const deletePageIDs = await _findFileIDs(deletePagesPath);
    deletePageIDs.push(pageID);
    for (const pageID of deletePageIDs) {
      delete pagesConfig[pageID];
    }

    await fsPromises.rm(deletePagesPath, { recursive: true });
  }
  
  await fsPromises.writeFile(settingPagesPath, JSON.stringify(settingConfig));
});
