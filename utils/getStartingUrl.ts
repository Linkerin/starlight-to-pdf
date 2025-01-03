import type { Page } from 'puppeteer';

import { cliColor, cliLink } from './cliStylings';
import getNextUrl from './getNextUrl';
import gotoWithRetry from './gotoWithRetry';
import { logger } from '../services/Logger';

interface GetNextUrlParams {
  initialSearch?: boolean;
  page: Page;
  url: URL;
}

async function getStartingUrl({
  initialSearch = true,
  page,
  url
}: GetNextUrlParams): Promise<URL | null> {
  await gotoWithRetry(page, url.href);
  const nextUrl = await getNextUrl(page);

  if (nextUrl) return url;

  if (!initialSearch) return null;

  // recursive search for the page to start parsing
  const links = await page.$$eval('a', links => links.map(link => link.href));
  if (links.length === 0) return null;

  const visitedLinks = new Set<string>();
  visitedLinks.add(url.href);

  for (const link of links) {
    if (!link) continue;
    if (!URL.canParse(link, url.origin)) continue;

    const nextUrl = new URL(link, url.origin);
    if (nextUrl.hostname !== url.hostname) continue; // prevents fetching from other domains

    logger.info(
      cliColor(
        `Looking for next page. Navigating to ${cliLink(nextUrl.href)}...`,
        'black',
        { bright: true }
      )
    );

    visitedLinks.add(nextUrl.href);
    const nextResult = await getStartingUrl({
      url: nextUrl,
      initialSearch: false,
      page
    });

    if (nextResult) return nextResult;
  }

  logger.info('No more pages found.');

  return null;
}

export default getStartingUrl;
