'use server';

import prisma from 'src/services/prisma';
// middleware
import { ServerActionError } from 'src/lib/server/error';
// constants
import * as ErrorCode from 'src/constants/error-code';
import * as config from 'src/services/config';
// util
import * as FileUtil from 'src/lib/server/common/file';

export async function getProjectInfo(projectID: number) {
  const project = await prisma.project.findUnique({
    where: {
      id: projectID,
    },
  });

  if (!project) {
    throw new ServerActionError(ErrorCode.RESOURCE_NOT_FOUND);
  }

  return project
}

export async function prepareProjectSourceDir(projectPath: string) {
  const projectBasePath = `${config.PLUGIN_APP_BASH_PATH}/${projectPath}`;
  const pagesBasePath = `${projectBasePath}/pages`;
  const functionsBasePath = `${projectBasePath}/functions`;
  const metadataBasePath = `${projectBasePath}/metadata`;
  const settingBasePath = `${projectBasePath}/setting`;
  const textsBasePath = `${projectBasePath}/texts`;
  const variablesBasePath = `${projectBasePath}/variables`;
  const imageBasePath = `${projectBasePath}/images`;
  const isProjectDirReady = await FileUtil.checkAndPrepareDir(projectBasePath);
  const isPagesDirReady = await FileUtil.checkAndPrepareDir(pagesBasePath);
  const isFunctionsDirReady = await FileUtil.checkAndPrepareDir(functionsBasePath);
  const isMetadataDirReady = await FileUtil.checkAndPrepareDir(metadataBasePath);
  const isSettingDirReady = await FileUtil.checkAndPrepareDir(settingBasePath);
  const isTextsDirReady = await FileUtil.checkAndPrepareDir(textsBasePath);
  const isVariablesDirReady = await FileUtil.checkAndPrepareDir(variablesBasePath);
  const isImageDirReady = await FileUtil.checkAndPrepareDir(imageBasePath);
  if (
    !isProjectDirReady ||
    !isPagesDirReady ||
    !isFunctionsDirReady ||
    !isMetadataDirReady ||
    !isSettingDirReady ||
    !isTextsDirReady ||
    !isVariablesDirReady ||
    !isImageDirReady
  ) {
    throw new ServerActionError(ErrorCode.UNKNOWN_ERROR);
  }

  return {
    projectBasePath,
    pagesBasePath,
    functionsBasePath,
    metadataBasePath,
    settingBasePath,
    textsBasePath,
    variablesBasePath,
    imageBasePath,
  };
};
