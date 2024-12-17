import type { Page } from "puppeteer";

import type { Contents } from "./getContents";
import getNextUrl from "./getNextUrl";
import logger from "./logger";

interface GetHtmlContentParams {
  page: Page;
  htmlContent: string;
  contentsData: Set<Contents>;
}

async function getHtmlContent({
  page,
  htmlContent,
  contentsData,
}: GetHtmlContentParams): Promise<string> {
  const currentUrl = page.url();
  logger.info(`Parsing page: ${currentUrl}`);
  const urlsPromise = getNextUrl({ page });

  const headingPromise = page.$eval(
    "*:has(> h1#_top)",
    (el, currentUrl) => {
      return {
        html: el.outerHTML,
        contentRecord: {
          heading: el.querySelector("h1")?.innerText ?? "",
          url: currentUrl,
        },
      };
    },
    currentUrl,
  );
  const textPromise = page.$eval(".sl-markdown-content", (el) => {
    const element = el as HTMLElement;
    element.style.breakAfter = "page";

    return element.outerHTML;
  });
  const subheadingsPromise = page.$$eval(
    ".sl-markdown-content h2",
    (subheadings, currentUrl) =>
      subheadings.map((el) => ({
        heading: el.innerText,
        url: currentUrl + "#" + el.getAttribute("id"),
      })),
    currentUrl,
  );

  const [heading, text, subheadings] = await Promise.all([
    headingPromise,
    textPromise,
    subheadingsPromise,
  ]);

  const contents: Contents = heading.contentRecord;
  contents.children = subheadings;
  contentsData.add(contents);

  const content = htmlContent + heading.html + text;

  const urls = await urlsPromise;
  if (!urls.next) {
    logger.info("All pages were parsed.\n");
    return content;
  }

  await page.goto(urls.next, { waitUntil: "domcontentloaded" });

  const result = await getHtmlContent({
    page,
    htmlContent: content,
    contentsData,
  });

  return result;
}

export default getHtmlContent;
