import path from 'path';
import { readFile } from 'fs/promises';

import { cliLink } from './cliStylings';
import errorCatcher from './errorCatcher';
import { logger } from '../services/Logger';
import { ParsingError } from '../services/Errors';

async function getFileContent(route: string): Promise<string> {
  if (!route) {
    throw new ParsingError('File reading failed: invalid filepath provided.');
  }

  const filePath = path.resolve(path.normalize(route));

  const [error, content] = await errorCatcher(readFile(filePath, 'utf-8'));
  if (error) {
    throw new ParsingError(
      `Could not read the content from '${cliLink(filePath)}'.`,
      { originalErrorMessage: error.message }
    );
  }

  logger.info(`Extracted content from ${cliLink(filePath)}`);

  return content;
}

export default getFileContent;
