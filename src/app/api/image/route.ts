import fsPromises from 'fs/promises';
import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { prepareProjectSourceDir } from 'src/services/models/project/project';
import { SYSTEM_IMAGE_PATH } from 'src/services/config';

export async function GET(req: NextRequest, res: NextResponse) {
  if (!req.url) {
    return new NextResponse('Invalid request', { status: 400 });
  }

  const urlObj = new URL(req.url);
  const filename = urlObj.searchParams.get('filename');
  const projectID = urlObj.searchParams.get('projectID');
  const type = urlObj.searchParams.get('type');

  if (typeof filename !== 'string' || !type) {
    return new NextResponse('Invalid params', { status: 400 });
  }
  if (type === 'user' && !projectID) {
    return new NextResponse('projectID is required', { status: 400 })
  }
  
  const imageBasePath = type === 'system' ? SYSTEM_IMAGE_PATH : (await prepareProjectSourceDir(projectID as string)).imageBasePath;
  const imagePath = path.join(imageBasePath, filename);

  const imageBuffer = await fsPromises.readFile(imagePath);
  const imageStream = Buffer.from(imageBuffer);
  
  return new NextResponse(imageStream, {
    headers: {
      'Content-Disposition': `inline`,
      'Content-Type': 'image/jpeg',
    },
  });
}
