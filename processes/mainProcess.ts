import puppeteer from "puppeteer";
import { scrollPageToBottom } from "puppeteer-autoscroll-down";

import type CliArgs from "../utils/CliArgs";
import createBaseUrl from "../utils/createBaseUrl";
import getAllContent from "../utils/getAllContent";
import getContents from "../utils/getContents";
import getStartingUrl from "../utils/getStartingUrl";
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

  const baseUrl = createBaseUrl(cliArgs.url);
  if (!baseUrl) {
    logger.error(`Invalid URL provided: '${cliArgs.url}.`);
    process.exit(1);
  }

  const startTime = performance.now();

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 799, height: 1150 });
  page.setDefaultTimeout(60000);

  const startUrl = await getStartingUrl({
    page,
    url: baseUrl,
  });
  if (!startUrl) {
    logger.error(
      "The beginning of docs content was not found. Check the provided URL.",
    );
    process.exit(1);
  }

  logger.info(`Docs content was found. Starting page: ${startUrl.href}\n`);

  const { htmlContent, contentsData } = await getAllContent({
    page,
    htmlContent: "",
    contentsData: new Set(),
  });
  const contents = getContents(Array.from(contentsData), cliArgs);

  const body = `<base href="${baseUrl.origin}" />
                <style>
                aside,
                code,
                  figure,
                  pre {
                    break-inside: avoid !important;
                  }

                  .s2pdf-pagebreak {
                    break-after: page;
                  }
                </style>
                ${cliArgs.values["no-contents"] ? "" : contents}
                ${cliArgs.values.paddings ? `<style>@page { padding: ${cliArgs.values.paddings} }</style>` : ""}
                ${htmlContent}
               `;

  logger.info("Adjusting content. It may take a while...");

  await page.goto(startUrl.href, {
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
