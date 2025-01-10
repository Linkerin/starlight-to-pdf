import type { GoToOptions, Page } from 'puppeteer';

import approximateSleep from './approximateSleep';
import { cliLink, cliTextStyle } from './cliStylings';
import errorCatcher from './errorCatcher';
import { logger } from '../services/Logger';
import { ParsingError } from '../services/Errors';

async function gotoWithRetry(page: Page, href: string, options?: GoToOptions) {
  let numOfTries = 2;

  while (numOfTries >= 0) {
    const [error] = await errorCatcher(page.goto(href, options));
    if (!error) break;

    if (error && numOfTries > 0) {
      logger.warn(
        `Error occured while fetching ${cliLink(
          href
        )}. Retries left: ${cliTextStyle(numOfTries, 'bold')}. Retrying...`
      );
      numOfTries--;
      await approximateSleep(500); // waits for ~500ms before fetch retrying
    } else {
      throw new ParsingError(`Error occured while fetching '${href}.'`, {
        originalErrorMessage: error.message
      });
    }
  }
}

export default gotoWithRetry;
