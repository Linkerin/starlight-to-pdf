import type { Page, PuppeteerLifeCycleEvent } from 'puppeteer';

import { CLASSNAMES, SELECTORS } from '../lib/constants';
import { cliLink, cliNeutralText, cliTextStyle } from './cliStylings';
import type {
  Contents,
  GetAllContentParams,
  GetAllContentReturn
} from '../lib/types/common.types';
import errorCatcher from './errorCatcher';
import getNextUrl from './getNextUrl';
import gotoWithRetry from './gotoWithRetry';
import { logger } from '../services/Logger';
import { ParsingError } from '../services/Errors';

interface ProcessPageContentReturn {
  contents: Contents;
  html: string;
}

interface ParsePageParams {
  page: Page;
  internalLinks?: boolean;
}

interface ParsedData {
  heading: {
    html: string;
    text: string;
    url: string;
  };
  mainInfo: {
    html: string;
  };
  subheadings: {
    heading: string;
    url: string;
  }[];
}

interface ParsePageParams {
  page: Page;
  internalLinks?: boolean;
}

interface ParsedData {
  heading: {
    html: string;
    text: string;
    url: string;
  };
  mainInfo: {
    html: string;
  };
  subheadings: {
    heading: string;
    url: string;
  }[];
}

async function parsePage({
  page,
  internalLinks = false
}: ParsePageParams): Promise<ParsedData> {
  const currLink = page.url();

  const evaluatePage = async (link: string, isInternal: boolean) => {
    return page.evaluate(
      (link, selectors, classnames, isInternal) => {
        const currentUrl = new URL(link);
        const pathname = currentUrl.pathname;

        const heading = document.querySelector(
          selectors.heading
        ) as HTMLElement | null;
        heading?.classList.add(classnames.heading);
        heading?.setAttribute('id', pathname);

        const mainInfo = document.querySelector(selectors.mainInfo);
        mainInfo?.classList.add(classnames.pageBreak);

        const subheadings = Array.from(
          document.querySelectorAll(selectors.subheading)
        ).map(el => {
          const subheading = el as HTMLElement;
          if (isInternal) {
            const origId = el.getAttribute('id') ?? crypto.randomUUID();
            el.setAttribute('id', `${pathname}-${origId}`);
          }
          const id = subheading.getAttribute('id') ?? crypto.randomUUID();
          return {
            heading: subheading.innerText ?? '',
            url: isInternal ? `#${id}` : `${link}#${id}`
          };
        });

        return {
          heading: {
            html: heading?.outerHTML ?? '',
            text: heading?.innerText ?? '',
            url: isInternal ? `#${pathname}` : link
          },
          mainInfo: { html: mainInfo?.outerHTML ?? '' },
          subheadings
        };
      },
      link,
      SELECTORS,
      CLASSNAMES,
      isInternal
    );
  };

  const [error, parsedData] = await errorCatcher(
    evaluatePage(currLink, internalLinks)
  );

  if (error) {
    throw new ParsingError(`Failed to parse page: '${currLink}'`, {
      originalErrorMessage: error.message
    });
  }

  return parsedData;
}

async function processPageContent(
  page: Page,
  internalLinks?: boolean
): Promise<ProcessPageContentReturn> {
  const parsedData = await parsePage({ page, internalLinks });

  const contents: Contents = {
    heading: parsedData.heading.text,
    url: parsedData.heading.url,
    children: parsedData.subheadings
  };

  let html = parsedData.heading.html + parsedData.mainInfo.html;

  return { contents, html };
}

async function getAllContent({
  contentsData,
  htmlContent,
  page,
  cliArgs
}: GetAllContentParams): Promise<GetAllContentReturn> {
  let parsedHtml = '';
  const currUrl = page.url();

  const { exclude, last } = cliArgs.values;
  const isExcluded = !!exclude && exclude.has(currUrl);
  const isLastPage = !!last && currUrl === last;

  if (!isExcluded) {
    logger.info(cliNeutralText(`Parsing page: ${cliLink(currUrl)}`));
    const contentsLinksInternal =
      cliArgs.values['contents-links'] === 'internal' ? true : false;
    const { contents, html } = await processPageContent(
      page,
      contentsLinksInternal
    );
    contentsData.add(contents);
    parsedHtml = html;
  } else {
    logger.info(`Page excluded: ${cliLink(currUrl)}`);
  }

  const updatedHtmlContent = htmlContent + parsedHtml;

  const nextUrl = await getNextUrl(page);
  if (isLastPage || !nextUrl) {
    if (isLastPage) {
      logger.info(
        `Parsing finishes: encountered user defined last page: ${cliLink(last)}`
      );
    }

    logger.info(
      cliNeutralText(
        `All pages were parsed. Web pages total: ${cliTextStyle(
          contentsData.size,
          'bold'
        )}.\n`
      )
    );
    return {
      htmlContent: updatedHtmlContent,
      contentsData
    };
  }

  await gotoWithRetry(page, nextUrl.href, {
    waitUntil:
      (cliArgs.values['page-wait-until'] as PuppeteerLifeCycleEvent) ??
      'domcontentloaded'
  });

  return getAllContent({
    htmlContent: updatedHtmlContent,
    contentsData: contentsData,
    page,
    cliArgs
  });
}

export default getAllContent;
