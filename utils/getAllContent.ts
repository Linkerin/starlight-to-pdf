import type { Page } from 'puppeteer';

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
  cliArgs
}: GetAllContentParams): Promise<GetAllContentReturn> {
  let parsedHtml = '';
  const currUrl = page.url();

  const { exclude, last } = cliArgs.values;
  const isExcluded = !!exclude && exclude.has(currUrl);
  const isLastPage = !!last && currUrl === last;

  if (!isExcluded) {
    logger.info(cliNeutralText(`Parsing page: ${cliLink(currUrl)}`));
    const { contents, html } = await processPageContent(page);
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

  await gotoWithRetry(page, nextUrl.href, { waitUntil: 'domcontentloaded' });

  return getAllContent({
    htmlContent: updatedHtmlContent,
    contentsData: contentsData,
    page,
    cliArgs
  });
}

export default getAllContent;
