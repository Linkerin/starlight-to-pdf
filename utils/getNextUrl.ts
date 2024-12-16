import type { Page } from "puppeteer";

import errorCatcher from "./errorCatcher";
import logger from "./logger";

interface GetNextUrlParams {
  page: Page;
  host: string;
  initialSearch?: boolean;
}

interface RecursiveNextUrlSearchParams {
  page: Page;
  host: string;
  visitedLinks: Set<string>;
}

export interface GetNextUrlReturn {
  next: string | null;
  current: string;
}

async function recursiveNextUrlSearch({
  page,
  host,
  visitedLinks,
}: RecursiveNextUrlSearchParams): Promise<GetNextUrlReturn> {
  let result: GetNextUrlReturn = {
    current: page.url(),
    next: null,
  };

  const allLinks = await page.$$eval("a", (links) =>
    links.map((link) => link.href),
  );
  if (allLinks.length === 0) return result;

  for (const link of allLinks) {
    if (visitedLinks.has(link)) continue;

    const nextUrl = new URL(link);
    if (nextUrl.host !== host) continue;

    logger.info(`Looking for next page. Navigating to ${nextUrl.href}...`);
    visitedLinks.add(link);
    await page.goto(nextUrl.href);
    const nextLink = await getNextUrl({ page, host });

    if (nextLink.next) {
      result = nextLink;
      break;
    }
  }

  return result;
}

async function getNextUrl({
  page,
  host,
  initialSearch = false,
}: GetNextUrlParams): Promise<GetNextUrlReturn> {
  const result: GetNextUrlReturn = {
    current: page.url(),
    next: null,
  };

  const [error, nextLink] = await errorCatcher(
    page.$eval("a[rel='next']", (el: HTMLAnchorElement) => el.href),
  );

  if (!error) {
    result.next = nextLink;
    return result;
  }

  if (!initialSearch) {
    return result;
  }

  const visitedLinks = new Set<string>();
  visitedLinks.add(page.url());
  const recursiveNextLink = await recursiveNextUrlSearch({
    page,
    host,
    visitedLinks,
  });

  if (recursiveNextLink) return recursiveNextLink;

  logger.info("No more pages found.");

  return result;
}

export default getNextUrl;
