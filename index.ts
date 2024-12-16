import puppeteer from "puppeteer";
import { scrollPageToBottom } from "puppeteer-autoscroll-down";

import cliArgs from "./utils/cliArgs";
import logger from "./utils/logger";
import { getVersion, showVersion } from "./utils/version";
import getBaseUrl from "./utils/getBaseUrl";
import getNextUrl from "./utils/getNextUrl";
import getHtmlContent from "./utils/getHtmlContent";

if (cliArgs.values.version) {
  await showVersion();
  process.exit(0);
}

if (!cliArgs.values.url) {
  logger.error("URL for parsing is required. Provide `--url` argument value.");
  process.exit(0);
}

const version = await getVersion();

logger.info("Welcome to Starlight to PDF tool! 📖");
logger.info(`version: ${version}\n`);

const [error, baseUrl] = getBaseUrl(cliArgs.values.url);
if (error) {
  logger.error(
    `Invalid URL: '${cliArgs.values.url}'.\nError: ${error.message}`,
  );
  process.exit(0);
}

const startTime = performance.now();

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.goto(baseUrl.href);

const startUrls = await getNextUrl({
  page,
  host: baseUrl.host,
  initialSearch: true,
});

if (!startUrls.next) {
  logger.error(
    "The beginning of docs content was not found. Check the provided URL.",
  );
  await browser.close();

  process.exit(0);
}

logger.info(`Docs content was found. Starting page: ${page.url()}\n`);
await page.setViewport({ width: 799, height: 1024 });

const htmlContent = await getHtmlContent({
  page,
  htmlContent: "",
  host: startUrls.current,
});

const body = `<base href="${baseUrl.origin}" />
    ${htmlContent}
  `;

logger.info("Adjusting content...");

await page.goto(startUrls.current, {
  waitUntil: "networkidle2",
});
await page.evaluate((result) => {
  const body = document.body;
  body.innerHTML = result;
  return body.innerHTML;
}, body);
await scrollPageToBottom(page, {});

logger.info("Generating PDF. Please wait.\n");
await page.pdf({
  path: `./${baseUrl.hostname}.pdf`,
  format: "A4",
  printBackground: true,
  margin: {
    top: "1cm",
    right: "1cm",
    bottom: "1cm",
    left: "1.5cm",
  },
});

await browser.close();

const finishTime = performance.now();
const timeTaken = ((finishTime - startTime) / 1000).toFixed(2) + " s";

logger.success(
  `PDF file was generated. Time consumed: ${timeTaken}. Thanks for using Starlight to PDF.`,
);
process.exit(0);
