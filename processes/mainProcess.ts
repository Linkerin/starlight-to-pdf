import puppeteer from "puppeteer";
import { scrollPageToBottom } from "puppeteer-autoscroll-down";

import type CliArgs from "../utils/CliArgs";
import getBaseUrl from "../utils/getBaseUrl";
import getContents, { type Contents } from "../utils/getContents";
import getNextUrl from "../utils/getNextUrl";
import getHtmlContent from "../utils/getHtmlContent";
import { getVersion } from "../utils/version";
import logger from "../utils/logger";
import recordPdf from "../utils/recordPdf";

async function mainProcess(cliArgs: CliArgs) {
  if (!cliArgs.url) {
    logger.error(
      "URL for parsing is required. Provide `--url` argument value.",
    );
    process.exit(1);
  }

  const version = await getVersion();

  logger.info("Welcome to Starlight to PDF tool! 📖");
  logger.info(`version: ${version}\n`);

  const [error, baseUrl] = getBaseUrl(cliArgs.url);
  if (error) {
    logger.error(`Invalid URL: '${cliArgs.url}'.\nError: ${error.message}`);
    process.exit(1);
  }

  const startTime = performance.now();

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(baseUrl.href);

  const startUrls = await getNextUrl({
    page,
    hostname: baseUrl.hostname,
    initialSearch: true,
  });

  if (!startUrls.next) {
    logger.error(
      "The beginning of docs content was not found. Check the provided URL.",
    );
    await browser.close();

    process.exit(1);
  }

  logger.info(`Docs content was found. Starting page: ${page.url()}\n`);
  await page.setViewport({ width: 799, height: 1150 });

  const contentsData = new Set<Contents>();

  const htmlContent = await getHtmlContent({
    page,
    htmlContent: "",
    contentsData,
  });
  const contents = getContents(Array.from(contentsData), cliArgs);

  const body = `<base href="${baseUrl.origin}" />
                <style>
                  figure,
                  pre,
                  code {
                    break-inside: avoid !important;
                  }
                </style>
                ${cliArgs.values["no-contents"] ? "" : contents}
                ${cliArgs.values.paddings ? `<style>@page { padding: ${cliArgs.values.paddings} }</style>` : ""}
                ${htmlContent}
               `;

  logger.info("Adjusting content. It may take a while...");

  await page.goto(startUrls.current, {
    waitUntil: "networkidle2",
  });
  await page.evaluate((result) => {
    const body = document.body;
    body.innerHTML = result;
    return body.innerHTML;
  }, body);
  await scrollPageToBottom(page, { size: 1100 });

  await recordPdf({ cliArgs, hostname: baseUrl.hostname, page });

  await browser.close();

  const finishTime = performance.now();
  const timeTaken = ((finishTime - startTime) / 1000).toFixed(2) + "s";

  logger.info(`Total processing time: ${timeTaken}.`);
  logger.info("Thank you for using Starlight to PDF!✨");
  process.exit(0);
}

export default mainProcess;
