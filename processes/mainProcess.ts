import puppeteer, { Browser } from 'puppeteer';
import { scrollPageToBottom } from 'puppeteer-autoscroll-down';

import type CliArgs from '../services/CliArgs';
import { cliColor, cliLink, cliTextStyle } from '../utils/cliStylings';
import composeBody from '../utils/composeBody';
import getAllContent from '../utils/getAllContent';
import getStartingUrl from '../utils/getStartingUrl';
import getVersion from '../utils/getVersion';
import { logger } from '../services/Logger';
import { ParsingError, ValidationError } from '../services/Errors';
import recordPdf from '../utils/recordPdf';
import { TIMEOUT_MS } from '../lib/constants';

const cliToolName = `${cliColor('Starlight', 'yellow', {
  bright: true
})} ${cliColor('to', 'black', {
  bright: true
})} ${cliColor('PDF', 'red', { bright: true })}`;

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
    logger.info(`Welcome to ${cliToolName} tool! 📖`);
    if (version) {
      logger.info(
        cliColor(`version: ${version}\n`, 'black', {
          bright: true
        })
      );
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

    logger.info(
      `Docs content was found. Starting page: ${cliLink(startUrl.href)}\n`
    );

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

    logger.info(
      cliColor('Adjusting content. It may take a while...', 'black', {
        bright: true
      })
    );
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

    logger.info(
      cliColor(
        `Total processing time: ${cliTextStyle(timeTaken, 'bold')}.`,
        'black',
        { bright: true }
      )
    );
    logger.info(`Thank you for using ${cliToolName}!✨\n`);
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
