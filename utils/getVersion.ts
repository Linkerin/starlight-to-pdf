import { resolve } from 'path';
import { readFile } from 'fs/promises';

import errorCatcher from './errorCatcher';

async function getVersion(): Promise<string | null> {
  const packagePath = resolve(__dirname, '../package.json');
  const [error, file] = await errorCatcher(
    readFile(packagePath, { encoding: 'utf8' })
  );
  if (error) return null;

  const contents = JSON.parse(file);
  if (!contents.version) return null;

  return contents.version;
}

export default getVersion;
