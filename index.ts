#!/usr/bin/env node

import CliArgs from './services/CliArgs';
import { cliColor, cliNeutralText, cliTextStyle } from './utils/cliStylings';
import helpProcess from './processes/helpProcess';
import { logger } from './services/Logger';
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
    logger.error(
      `${cliColor(cliTextStyle(err.name, 'bold'), 'red')}: ${err.message}`
    );
    if (err.additionalInfo?.originalErrorMessage) {
      logger.error(
        `${cliColor(cliTextStyle('Error', 'bold'), 'red')}: ${
          err.additionalInfo.originalErrorMessage
        }`
      );
    }
  } else {
    logger.error('Unknown error occurred.');
    if (err instanceof Error) {
      logger.error(
        `${cliColor(cliTextStyle('Error', 'bold'), 'red')}: ${err.message}`
      );
    }
  }

  logger.error(cliNeutralText('Program exits.'));
  logger.stop();

  process.exit(1);
}
