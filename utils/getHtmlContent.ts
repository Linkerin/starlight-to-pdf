import type { Page } from "puppeteer";

import getNextUrl from "./getNextUrl";
import logger from "./logger";

interface GetHtmlContentParams {
  page: Page;
  htmlContent: string;
  host: string;
}

async function getHtmlContent({
  page,
  htmlContent,
  host,
}: GetHtmlContentParams): Promise<string> {
  logger.info(`Parsing page: ${page.url()}`);
  const urls = await getNextUrl({ page, host });

  const heading = await page.$eval("h1#_top", (el) => el.outerHTML);
  const text = await page.$eval(".sl-markdown-content", (el) => el.outerHTML);

  let content = htmlContent + heading + text;

  if (!urls.next) {
    logger.info(`No more pages for parsing. The last one is: ${page.url()}\n`);
    return content;
  }

  await page.goto(urls.next);

  const result = await getHtmlContent({ page, htmlContent: content, host });

  return result;
}

export default getHtmlContent;
