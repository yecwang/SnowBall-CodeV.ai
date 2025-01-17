'use server';

/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */

import fs from 'node:fs/promises';
import path from 'node:path';
import prisma from 'src/services/prisma';
// middleware
import withServerAction from 'src/lib/server/middware/with-server-action';
// constants
import * as config from 'src/services/config';
//
import { TServerActionContext } from 'src/types/server/server-action';
import { TFunction } from 'src/pluginapp-context-manager/types';

import { ServerActionError } from 'src/lib/server/error';

export const updateFunctions = withServerAction(
  'PROJECT_UPDATE_FUNCTIONS',
  async (context: TServerActionContext, id: number, functions: TFunction[], type?: string) => {
    if (!functions) {
      throw new ServerActionError('functions is required');
    }

    const project = await prisma.project.findUnique({ where: { id } });
    const projectPath = project?.path;
    if (!projectPath) {
      throw new ServerActionError('RESOURCES_NOT_FOUND');
    }
    const projectBasePath = `${config.PLUGIN_APP_BASH_PATH}/${projectPath}`;
    const functionsBasePath = `${projectBasePath}/functions`;
    if (type !== 'CREATE' ) {
      const functionsCode = functions.map((func) => func.code).join('\n');
      const exportFunctionsCode = `export default { ${functions.map((func) => func.name).join(', ')} }`;
      await fs.writeFile(`${functionsBasePath}/index.ts`, `${functionsCode}\n${exportFunctionsCode}`);
    }
    await fs.writeFile(`${functionsBasePath}/index.json`, JSON.stringify(functions));
  }
);
