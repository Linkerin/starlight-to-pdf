import puppeteer, { Browser } from 'puppeteer';
import { scrollPageToBottom } from 'puppeteer-autoscroll-down';
import yoctoSpinner from 'yocto-spinner';

import { CLASSNAMES, TIMEOUT_MS } from '../lib/constants';
import type CliArgs from '../services/CliArgs';
import getAllContent from '../utils/getAllContent';
import createContents from '../utils/createContents';
import getStartingUrl from '../utils/getStartingUrl';
import { getVersion } from '../utils/version';
import logger from '../services/logger';
import recordPdf from '../utils/recordPdf';
import { ParsingError, ValidationError } from '../services/Errors';

async function mainProcess(cliArgs: CliArgs) {
  let browser: Browser | null = null;
  const spinner = yoctoSpinner();

  try {
    if (!cliArgs.values.url) {
      throw new ValidationError(
        'URL for parsing is required. Provide `--url` argument value.'
      );
    }

    const version = await getVersion();

    logger.info('Welcome to Starlight to PDF tool! 📖');
    if (version) {
      logger.info(`version: ${version}\n`);
    }

    spinner.start();
    const baseUrl = cliArgs.values.url;

    const startTime = performance.now();

    browser = await puppeteer.launch({
      headless: true,
      protocolTimeout: cliArgs.values.timeout ?? TIMEOUT_MS
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 799, height: 1150 });
    page.setDefaultTimeout(cliArgs.values.timeout ?? TIMEOUT_MS);
    spinner.stop();

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
    const contents = createContents(Array.from(contentsData), cliArgs);

    const body = `<base href="${baseUrl.origin}" />
                  <style>
                    aside,
                    code,
                    figure,
                    pre {
                      break-inside: avoid !important;
                    }

                    .${CLASSNAMES.pageBreak} {
                      break-after: page;
                    }
                  </style>
                  ${cliArgs.values['no-contents'] ? '' : contents}
                  ${
                    cliArgs.values.paddings
                      ? `<style>@page { padding: ${cliArgs.values.paddings} }</style>`
                      : ''
                  }
                  ${htmlContent}
               `;

    logger.info('Adjusting content. It may take a while...');
    spinner.start();
    await page.goto(startUrl.href, {
      waitUntil: 'networkidle2'
    });
    await page.evaluate(result => {
      const body = document.body;
      body.innerHTML = result;
      return body.innerHTML;
    }, body);
    await scrollPageToBottom(page, { size: 1100 });
    spinner.stop();

    await recordPdf({ cliArgs, hostname: baseUrl.hostname, page, spinner });

    await browser.close();

    const finishTime = performance.now();
    const timeTaken = ((finishTime - startTime) / 1000).toFixed(2) + 's';

    logger.info(`Total processing time: ${timeTaken}.`);
    logger.info('Thank you for using Starlight to PDF!✨');

    process.exit(0);
  } catch (err) {
    spinner.stop();
    if (browser) {
      await browser.close();
    }

    throw err;
  }
}

export default mainProcess;
