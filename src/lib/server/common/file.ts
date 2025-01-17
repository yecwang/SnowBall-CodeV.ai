'use server'

import fs from 'fs/promises'
import path from 'path'


/**
 * Checks if a directory exists and prepares it if it doesn't.
 * If the directory doesn't exist, it creates the directory and its parent directories recursively.
 * 
 * @param dirPath - The path of the directory to check and prepare.
 * @returns A Promise that resolves to a boolean indicating whether the directory exists or was successfully prepared.
 */
export async function checkAndPrepareDir(dirPath: string): Promise<boolean> {
  try {
    await fs.access(dirPath)
    return true
  }
  catch (err) {
    console.log('error: ', err.message)
    if (err.code === 'ENOENT') {
      const parentDir = path.dirname(dirPath);
      await checkAndPrepareDir(parentDir);
      await fs.mkdir(dirPath);
      return true
    }
    return false
  }
}

export async function readFileConvertToObj<T = any>(filePath: string) {
  const str = await fs.readFile(filePath, { encoding: 'utf-8' });
  return JSON.parse(str) as T;
};
