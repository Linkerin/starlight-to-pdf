import type { Page } from 'puppeteer';

import { cliLink, cliNeutralText } from './cliStylings';
import getNextUrl from './getNextUrl';
import gotoWithRetry from './gotoWithRetry';
import { logger } from '../services/Logger';

interface GetNextUrlParams {
  page: Page;
  url: URL;
}

async function getStartingUrl(
  { page, url }: GetNextUrlParams,
  visited?: Set<string>
): Promise<URL | null> {
  await gotoWithRetry(page, url.href);
  const nextUrl = await getNextUrl(page);

  if (nextUrl) return url;

  // recursive search for the page to start parsing
  const links = await page.$$eval('a', links => links.map(link => link.href));
  if (links.length === 0) return null;

  const visitedLinks = visited ?? new Set<string>();
  visitedLinks.add(url.href);

  for (const link of links) {
    if (!link || visitedLinks.has(link)) continue;
    if (!URL.canParse(link, url.origin)) continue;

    const nextUrl = new URL(link, url.origin);
    if (nextUrl.hostname !== url.hostname) continue; // prevents fetching from other domains

    logger.info(
      cliNeutralText(
        `Looking for next page. Navigating to ${cliLink(nextUrl.href)}...`
      )
    );

    visitedLinks.add(nextUrl.href);
    const nextResult = await getStartingUrl(
      { url: nextUrl, page },
      visitedLinks
    );

    if (nextResult) return nextResult;
  }

  return null;
}

export default getStartingUrl;
