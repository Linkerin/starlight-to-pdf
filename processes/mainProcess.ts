import puppeteer, { Browser } from 'puppeteer';
import { scrollPageToBottom } from 'puppeteer-autoscroll-down';

import type CliArgs from '../services/CliArgs';
import getAllContent from '../utils/getAllContent';
import composeBody from '../utils/composeBody';
import getStartingUrl from '../utils/getStartingUrl';
import getVersion from '../utils/getVersion';
import { logger } from '../services/Logger';
import { ParsingError, ValidationError } from '../services/Errors';
import recordPdf from '../utils/recordPdf';
import { TIMEOUT_MS } from '../lib/constants';

async function mainProcess(cliArgs: CliArgs) {
  let browser: Browser | null = null;

  try {
    if (!cliArgs.values.url) {
      throw new ValidationError(
        'URL for parsing is required. Provide `--url` argument value.'
      );
    }

    const version = await getVersion();

    logger.start();
    logger.info('Welcome to Starlight to PDF tool! 📖');
    if (version) {
      logger.info(`version: ${version}\n`);
    }

    const baseUrl = cliArgs.values.url;

    const startTime = performance.now();

    browser = await puppeteer.launch({
      headless: true,
      protocolTimeout: cliArgs.values.timeout ?? TIMEOUT_MS
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 799, height: 1150 });
    page.setDefaultTimeout(cliArgs.values.timeout ?? TIMEOUT_MS);

    const startUrl = await getStartingUrl({
      page,
      url: baseUrl
    });
    if (!startUrl) {
      throw new ParsingError(
        'The beginning of docs content was not found. Check the provided URL.'
      );
    }

    logger.info(`Docs content was found. Starting page: ${startUrl.href}\n`);

    const { htmlContent, contentsData } = await getAllContent({
      page,
      htmlContent: '',
      contentsData: new Set(),
      exclude: cliArgs.values.exclude
    });

    const body = composeBody({
      baseOrigin: baseUrl.origin,
      cliArgs,
      contentsData,
      htmlContent
    });

    logger.info('Adjusting content. It may take a while...');
    await page.goto(startUrl.href, {
      waitUntil: 'networkidle2'
    });
    await page.evaluate(result => {
      const body = document.body;
      body.innerHTML = result;
      return body.innerHTML;
    }, body);
    await scrollPageToBottom(page, { size: 1100 });

    await recordPdf({ cliArgs, hostname: baseUrl.hostname, page });

    await browser.close();

    const finishTime = performance.now();
    const timeTaken = ((finishTime - startTime) / 1000).toFixed(2) + 's';

    logger.info(`Total processing time: ${timeTaken}.`);
    logger.info('Thank you for using Starlight to PDF!✨');
    logger.stop();

    process.exit(0);
  } catch (err) {
    if (browser) {
      await browser.close();
    }

    throw err;
  }
}

export default mainProcess;
