#!/usr/bin/env node

import CliArgs from './services/CliArgs';
import helpProcess from './processes/helpProcess';
import logger from './services/Logger';
import mainProcess from './processes/mainProcess';
import { ParsingError, ValidationError } from './services/Errors';
import versionProcess from './processes/versionProcess';

try {
  const cliArgs = new CliArgs();

  if (cliArgs.values.version) {
    await versionProcess();
  }

  if (cliArgs.values.help) {
    helpProcess();
  }

  await mainProcess(cliArgs);
} catch (err) {
  if (err instanceof ValidationError || err instanceof ParsingError) {
    logger.error(`${err.name}: ${err.message}`);
    if (err.additionalInfo?.originalErrorMessage) {
      logger.error(`Error: ${err.additionalInfo.originalErrorMessage}`);
    }
  } else {
    logger.error('Unknown error occurred.');
    if (err instanceof Error) {
      logger.error(`Error: ${err.message}`);
    }
  }

  logger.error('Program exits.');

  process.exit(1);
}
