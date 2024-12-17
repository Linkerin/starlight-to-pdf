import type { Page } from "puppeteer";

import getNextUrl from "./getNextUrl";
import logger from "./logger";

interface GetHtmlContentParams {
  page: Page;
  htmlContent: string;
}

async function getHtmlContent({
  page,
  htmlContent,
}: GetHtmlContentParams): Promise<string> {
  logger.info(`Parsing page: ${page.url()}`);
  const urls = await getNextUrl({ page });

  const heading = await page.$eval("*:has(> h1#_top)", (el) => el.outerHTML);
  const text = await page.$eval(".sl-markdown-content", (el) => {
    const element = el as HTMLElement;
    element.style.breakAfter = "page";

    return element.outerHTML;
  });

  const content = htmlContent + heading + text;

  if (!urls.next) {
    logger.info("All pages were parsed.\n");
    return content;
  }

  await page.goto(urls.next, { waitUntil: "domcontentloaded" });

  const result = await getHtmlContent({ page, htmlContent: content });

  return result;
}

export default getHtmlContent;
