import type { Page } from 'puppeteer';

import type { Contents } from './getContents';
import { CLASSNAMES, SELECTORS } from '../lib/constants';
import errorCatcher from './errorCatcher';
import getNextUrl from './getNextUrl';
import logger from './logger';
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

interface GetAllContentParams {
  htmlContent: string;
  contentsData: Set<Contents>;
  page: Page;
}

type GetAllContentReturn = Omit<GetAllContentParams, 'url' | 'page'>;

async function getAllContent({
  contentsData,
  htmlContent,
  page
}: GetAllContentParams): Promise<GetAllContentReturn> {
  logger.info(`Parsing page: ${page.url()}`);

  const { contents, html } = await processPageContent(page);
  contentsData.add(contents);

  const updatedHtmlContent = htmlContent + html;

  const nextUrl = await getNextUrl(page);
  if (!nextUrl) {
    logger.info(
      `All pages were parsed. Web pages total: ${contentsData.size}.\n`
    );
    return {
      htmlContent: updatedHtmlContent,
      contentsData
    };
  }

  await page.goto(nextUrl.href, { waitUntil: 'domcontentloaded' });

  return getAllContent({
    htmlContent: updatedHtmlContent,
    contentsData: contentsData,
    page
  });
}

export default getAllContent;
