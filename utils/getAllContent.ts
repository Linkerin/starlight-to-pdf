import type { Page } from 'puppeteer';

import { CLASSNAMES, SELECTORS } from '../lib/constants';
import { cliColor, cliLink, cliTextStyle } from './cliStylings';
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

async function processPageContent(
  page: Page
): Promise<ProcessPageContentReturn> {
  const currentLink = page.url();

  const [error, parsedData] = await errorCatcher(
    page.evaluate(
      (link, selectors, classnames) => {
        const heading = document.querySelector(
          selectors.heading
        ) as HTMLElement | null;
        heading?.classList.add(classnames.heading);

        const mainInfo = document.querySelector(selectors.mainInfo);
        mainInfo?.classList.add(classnames.pageBreak);

        const subheadingElements = document.querySelectorAll(
          selectors.subheading
        ) as NodeListOf<HTMLElement>;
        const subheadings = Array.from(subheadingElements);

        return {
          heading: {
            html: heading?.outerHTML ?? '',
            text: heading?.innerText ?? ''
          },
          mainInfo: { html: mainInfo?.outerHTML ?? '' },
          subheadings: subheadings.map(el => ({
            heading: el.innerText ?? '',
            url: link + '#' + el.getAttribute('id')
          }))
        };
      },
      currentLink,
      SELECTORS,
      CLASSNAMES
    )
  );

  if (error) {
    throw new ParsingError(
      `Didn't manage to parse the following page: '${currentLink}'`,
      { originalErrorMessage: error.message }
    );
  }

  const contents: Contents = {
    heading: parsedData.heading.text,
    url: currentLink,
    children: parsedData.subheadings
  };

  let html = parsedData.heading.html + parsedData.mainInfo.html;

  return { contents, html };
}

async function getAllContent({
  contentsData,
  htmlContent,
  page,
  exclude
}: GetAllContentParams): Promise<GetAllContentReturn> {
  let parsedHtml = '';
  const currUrl = page.url();
  const isExcluded = !!exclude && exclude.has(currUrl);

  if (!isExcluded) {
    logger.info(
      cliColor(`Parsing page: ${cliLink(currUrl)}`, 'black', { bright: true })
    );
    const { contents, html } = await processPageContent(page);
    contentsData.add(contents);
    parsedHtml = html;
  } else {
    logger.info(`Page excluded: ${cliLink(currUrl)}`);
  }

  const updatedHtmlContent = htmlContent + parsedHtml;

  const nextUrl = await getNextUrl(page);
  if (!nextUrl) {
    logger.info(
      cliColor(
        `All pages were parsed. Web pages total: ${cliTextStyle(
          contentsData.size,
          'bold'
        )}.\n`,
        'black',
        { bright: true }
      )
    );
    return {
      htmlContent: updatedHtmlContent,
      contentsData
    };
  }

  await gotoWithRetry(page, nextUrl.href, { waitUntil: 'domcontentloaded' });

  return getAllContent({
    htmlContent: updatedHtmlContent,
    contentsData: contentsData,
    page,
    exclude
  });
}

export default getAllContent;
