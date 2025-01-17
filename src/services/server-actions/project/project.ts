'use server';

/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */

import fs from 'node:fs/promises';
import prisma from 'src/services/prisma';
// middleware
import withServerAction from 'src/lib/server/middware/with-server-action';
// constants
import * as ServerAction from 'src/constants/server-action';
import * as ErrorCode from 'src/constants/error-code';
// util
import * as FileUtil from 'src/lib/server/common/file';
import * as config from 'src/services/config';
// models
import * as projectModel from 'src/services/models/project/project';
//
import { TServerActionContext } from 'src/types/server/server-action';
import { TFunction, TProject, TProjectPages, PageConfigType, TSetting, TPagesConfig } from 'src/pluginapp-context-manager/types';

import { ServerActionError } from 'src/lib/server/error';
import path from 'node:path';

export const loadProject = withServerAction(
  ServerAction.PROJECT_LOAD,
  async (context: TServerActionContext, id: string) => {
    const _readPagesConfig = async (filename: string) => {
      try {
        const fileContent = await fs.readFile(filename, { encoding: 'utf8' });
        return JSON.parse(fileContent);
      } catch (err) {
        return {};
      }
    };
    const _readPages = async (dirPath: string) => {
      const results: TProjectPages = {};
      const files = await fs.readdir(dirPath, { withFileTypes: true });
      for (const file of files) {
        if (file.isDirectory()) {
          results[file.name] = await _readPages(`${dirPath}/${file.name}`);
          continue;
        }

        const filename = file.name.split('.')[0];
        const filePath = `${dirPath}/${file.name}`;
        results[filename] = await fs.readFile(filePath, { encoding: 'utf8' });
      }
      return results;
    };

    if (!id) {
      throw new ServerActionError(ErrorCode.RESOURCE_NOT_FOUND, 'id is required');
    }

    const projectInfo = await prisma.project.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!projectInfo) {
      throw new ServerActionError(ErrorCode.RESOURCE_NOT_FOUND);
    }

    const projectTemplate = _getDefaultProjectTemplate();
    const project: TProject = {
      id: projectInfo.id,
      name: projectInfo.name,
      description: projectInfo.description,
      setting: projectTemplate.setting,
      pages: projectTemplate.pages,
      // @ts-ignore
      functions: projectTemplate.functions,
      variables: projectTemplate.variables,
      metadata: projectTemplate.metadata,
      texts: projectTemplate.texts,
    };
    if (projectInfo.path) {
      // get path from project info
      const projectBasePath = `${config.PLUGIN_APP_BASH_PATH}/${projectInfo.path}`;
      // check if project dir is ready
      const isProjectDirReady = await FileUtil.checkAndPrepareDir(projectBasePath);
      if (!isProjectDirReady) {
        return project;
      }
      const dirs = await fs.readdir(projectBasePath);
      for (const dir of dirs) {
        const dirPath = `${projectBasePath}/${dir}`;
        switch (dir) {
          case 'functions': {
            try {
              project[dir] = JSON.parse(
                await fs.readFile(`${dirPath}/index.json`, { encoding: 'utf8' })
              );
            } catch (err) {
              project[dir] = [];
            }
            break;
          }
          case 'texts': {
            try {
              const files = await fs.readdir(dirPath);
              const textObj: any = {};
              for (const filePath of files) {
                const fileName = filePath.substring(
                  filePath.lastIndexOf('/') + 1,
                  filePath.lastIndexOf('.')
                );
                const fileContent = await fs.readFile(`${dirPath}/${filePath}`);
                let content = fileContent.toString();
                content = JSON.parse(content || '{}');
                textObj[fileName] = content;
              }
              project[dir] = textObj;
            } catch (err) {
              console.error(err);
              project[dir] = {};
            }
            break;
          }
          case 'variables': {
            try {
              const fileContent = await fs.readFile(`${dirPath}/index.ts`);
              project[dir] = fileContent.toString() || 'export const variables: object = {}';
            } catch (err) {
              console.error('variables error', err);
              project[dir] = 'export const variables: object = {}';
            }
            break;
          }
          case 'metadata': {
            project[dir] = await _readPagesConfig(`${dirPath}/index.json`);
            break;
          }
          case 'setting': {
            project[dir] = await _readPagesConfig(`${dirPath}/index.json`);
            break;
          }
          case 'pages': {
            project[dir] = await _readPages(dirPath);
            break;
          }
          default:
            break;
        }
      }
    }

    return project;
  }
);

export const create = withServerAction(
  ServerAction.PROJECT_CREATE,
  async (context: TServerActionContext, body: { name: string; description: string }) => {
    const { name, description } = body;

    const newData = {
      name,
      description,
      creatorID: Number(context.session?.id) as number,
    };

    const result = await prisma.project.create({
      data: newData,
    });

    const projectPath = `${result.id}`;
    // prepare the project source dirs
    const projectSourcePathObj = await projectModel.prepareProjectSourceDir(projectPath);
    // create default project files
    await _createDefaultProjectFiles(projectSourcePathObj);

    await prisma.project.update({
      where: {
        id: result.id,
      },
      data: {
        path: projectPath,
      },
    });

    return result;
  }
);

export const update = withServerAction(
  ServerAction.PROJECT_UPDATE,
  async (
    context: TServerActionContext,
    body: {
      id: number;
      name: string;
      description: string;
      pages: TProjectPages;
      setting: TSetting;
      functions: TFunction[];
      variables: string;
      metadata: string;
      texts: string;
      isLocked?: boolean;
    }
  ) => {
    const _updatePages = async (pages: TProjectPages, pagesConfig: TPagesConfig) => {
      const pageIDs = Object.keys(pages);
      for (const pageID of pageIDs) {
        if (pagesConfig[pageID].type === PageConfigType.Directory) {
          await _updatePages(pages[pageID] as TProjectPages, pagesConfig);
          continue;
        }

        await fs.writeFile(path.join(pagesBasePath, `${setting.pages[pageID].path}.jsx`), pages[pageID] as string);
      }
    }

    const { id, name, description, pages, setting, functions, variables, metadata, texts, isLocked } = body;
    const project = await prisma.project.findUnique({
      where: {
        id,
      },
    });

    if (!project) {
      throw new ServerActionError(ErrorCode.RESOURCE_NOT_FOUND);
    }
    let projectPath = project.path || '';
    if (!project.path) {
      projectPath = `${id}`;
    }
    const {
      pagesBasePath,
      functionsBasePath,
      metadataBasePath,
      settingBasePath,
      textsBasePath,
      variablesBasePath,
    } = await projectModel.prepareProjectSourceDir(projectPath);

    if (pages) {
      await _updatePages(pages, setting.pages)
    }
    if (texts) {
      const textIDs = Object.keys(texts);
      for (const textID of textIDs) {
        const textContent = texts[textID as keyof typeof texts];
        await fs.writeFile(`${textsBasePath}/${textID}.json`, JSON.stringify(textContent || {}));
      }
    }
    await fs.writeFile(`${functionsBasePath}/index.json`, JSON.stringify(functions || {}));
    await fs.writeFile(`${metadataBasePath}/index.json`, JSON.stringify(metadata || {}));
    await fs.writeFile(`${settingBasePath}/index.json`, JSON.stringify(setting || {}));
    await fs.writeFile(`${variablesBasePath}/index.ts`, variables || `export const variables = {}`);
    const updateInfo = {
      name,
      description,
      path: projectPath,
      isLocked,
    };

    const result = await prisma.project.update({
      where: {
        id,
      },
      data: updateInfo,
    });
    return result;
  }
);

export const updateInfo = withServerAction(
  ServerAction.PROJECT_UPDATE,
  async (
    context: TServerActionContext,
    body: {
      id: number;
      updateInfo: {
        name?: string;
        description?: string;
        isLocked?: boolean;
      }
    }
  ) => {
    const { id, updateInfo } = body;
    const project = await prisma.project.findUnique({
      where: {
        id,
      },
    });

    if (!project) {
      throw new ServerActionError(ErrorCode.RESOURCE_NOT_FOUND);
    }

    const result = await prisma.project.update({
      where: {
        id,
      },
      data: updateInfo,
    });
    return result;
  }
);

export const getList = withServerAction(
  ServerAction.PROJECT_GET_LIST,
  async (context: TServerActionContext) => {
    const userID = Number(context.session?.id) as number;
    return prisma.project.findMany({
      where: {
        creatorID: userID,
      },
      orderBy: {
        ctime: 'desc',
      },
    });
  }
);

export const getInfo = withServerAction(
  ServerAction.PROJECT_GET_INFO,
  async (context: TServerActionContext, id: number) =>
    prisma.project.findUnique({
      where: {
        id,
      },
    })
);

/**
 * create default project files
 * @param projectSourcePathObj project source path object
 */
const _createDefaultProjectFiles = async (projectSourcePathObj: any) => {
  const {
    pagesBasePath,
    functionsBasePath,
    metadataBasePath,
    settingBasePath,
    textsBasePath,
    variablesBasePath,
  } = projectSourcePathObj;

  const projectTemplate = _getDefaultProjectTemplate();
  // create default pages
  const pageIDs = Object.keys(projectTemplate.pages);
  for (const pageID of pageIDs) {
    const pageContent = projectTemplate.pages[pageID as keyof typeof projectTemplate.pages];
    await fs.writeFile(`${pagesBasePath}/${pageID}.jsx`, pageContent);
  }
  // create default texts
  // const functionConfig = projectTemplate.functions || [];
  // const functionsCode = functionConfig.map((func) => func.code).join('\n');
  // const exportFunctionsCode = `export default { ${functionConfig.map((func) => func.name).join(', ')} }`;
  // await fs.writeFile(`${functionsBasePath}/index.js`, `${functionsCode}\n${exportFunctionsCode}`);
  await fs.writeFile(
    `${functionsBasePath}/index.json`,
    JSON.stringify(projectTemplate.functions)
  );
  await fs.writeFile(
    `${functionsBasePath}/index.ts`,
    'export default {}',
  );
  // create default metadata
  await fs.writeFile(
    `${metadataBasePath}/index.json`,
    JSON.stringify(projectTemplate.metadata)
  );
  // create default setting
  await fs.writeFile(
    `${settingBasePath}/index.json`,
    JSON.stringify(projectTemplate.setting)
  );
  // create default variables
  await fs.writeFile(
    `${variablesBasePath}/index.json`,
    JSON.stringify(projectTemplate.variables)
  );
  await fs.writeFile(
    `${variablesBasePath}/index.ts`,
    'export default {}',
  );
  
  return projectTemplate;
};

const _getDefaultProjectTemplate = () => ({
  setting: {
    "pages": { "page1": { type: PageConfigType.Page, name: "default page", path: "page1" } },
    "entryPage": "page1"
  },
  pages: {
    page1: `
      import { Iconify } from 'ui-lib';
      import { Typography } from 'ui-lib';
      import funs from 'funs';
      import { Box } from 'ui-lib';
      import { Button } from 'ui-lib';
      import { TextField } from 'ui-lib';
      import { Image } from 'ui-lib';
      export default function Page() {
        return <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%'
        }} id="container3">
          <Image id="images2" src="/assets/images/faqs/hero.jpg" alt="图片" sx={{ height: '280px' }} />
          <Box id="box_1690168685941_500" sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            marginTop: '20px',
            padding: '10px'
          }}>
            <TextField id="textfield_username" label="用户名" sx={{ width: '100%' }} />
            <TextField id="textfield_pwd" label="密码" sx={{ width: '100%', marginTop: '20px' }} />
            <Button id="Button_1690168685941_500" sx={{ width: '100%', marginTop: '50px' }} variant="contained" color="primary" onClick={() => {console.log('click event');}}>按钮</Button>
          </Box>
        </Box>;
      }`,
  },
  functions: [],
  variables: {},
  metadata: {},
  texts: {
    en: {},
    cn: {},
  },
});
