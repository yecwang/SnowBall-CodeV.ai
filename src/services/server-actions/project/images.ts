'use server';

/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */

import fsPromises from 'node:fs/promises';
// middleware
import withServerAction from 'src/lib/server/middware/with-server-action';
//
import { TServerActionContext } from 'src/types/server/server-action';
import { prepareProjectSourceDir } from 'src/services/models/project/project';
import uuidv4 from 'src/lib/client/utils/uuidv4';
import { SYSTEM_IMAGE_PATH } from 'src/services/config';

export const uploadImage = withServerAction('UPLOAD_IMAGE', async (context: TServerActionContext, body: FormData) => {
    const file = body.get('file') as File;
    const projectID = body.get('projectID') as string;

    if (!file || !projectID) {
      console.error('Invalid file or projectID');
      return null;
    }

    const buf = await file.arrayBuffer();
    const fileType = file.name.split('.').pop();
    const { imageBasePath } = await prepareProjectSourceDir(projectID);
    const imageFilename = `${uuidv4()}.${fileType}`;
    const imagePath = `${imageBasePath}/${imageFilename}`;

    await fsPromises.writeFile(imagePath, Buffer.from(buf));
    return { imageFilename };
  }
);

const imageExtensions = ['png', 'jpg', 'jpeg'];

export const getImages = withServerAction('GET_IMAGES', async (context: TServerActionContext, body: { projectID: string, type: 'user' | 'system' }) => {
    const { projectID, type } = body;
    const { imageBasePath } = await prepareProjectSourceDir(projectID);
    const imagePath = type === 'system' ? SYSTEM_IMAGE_PATH : imageBasePath;
    try {
      const files = await fsPromises.readdir(imagePath);
      return files.filter(filename => {
        const extension = filename.split('.').pop();
        return extension && imageExtensions.includes(extension);
      });
    } catch (error) {
      return [];
    }
});
