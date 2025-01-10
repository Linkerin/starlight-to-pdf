import { CLASSNAMES } from '../lib/constants';

import type CliArgs from '../services/CliArgs';
import { cliColor, cliTextStyle } from './cliStylings';
import type { Contents, GetAllContentReturn } from '../lib/types/common.types';
import getFileContent from './getFileContent';
import { logger } from '../services/Logger';

function composeListEl(contentData: Contents[]): string {
  let contentsHtml = '';

  contentData.forEach(value => {
    contentsHtml += `<li><a href="${value.url}">${value.heading}</a>`;
    if (value.children) {
      contentsHtml += composeListEl(value.children);
    }

    contentsHtml += `</li>`;
  });

  const result = `<ul ${CLASSNAMES.contents}>${contentsHtml}</ul>`;

  return result;
}

function createContents(contentData: Contents[], cliArgs: CliArgs): string {
  const list = composeListEl(contentData);
  const defaultContentsName = 'Contents';
  const contentsName = cliArgs.values['contents-name'] ?? defaultContentsName;

  logger.info(
    `Created table of contents.${
      contentsName !== defaultContentsName
        ? ` User defined name: \`${cliColor(
            cliTextStyle(contentsName, 'bold'),
            'yellow'
          )}\``
        : ''
    }`
  );

  return `<div class="${CLASSNAMES.starlight.markdownContent} ${CLASSNAMES.contents} ${CLASSNAMES.pageBreak}">
            <h2>${contentsName}</h2>
            ${list}
          </div>`;
}

interface ComposeBodyParams extends GetAllContentReturn {
  baseOrigin: string;
  cliArgs: CliArgs;
}

async function composeBody({
  baseOrigin,
  cliArgs,
  contentsData,
  htmlContent
}: ComposeBodyParams): Promise<string> {
  const contents = cliArgs.values['no-contents']
    ? ''
    : createContents(Array.from(contentsData), cliArgs);

  const {
    paddings,
    styles,
    'following-html': followingRoute,
    'preceding-html': precedingRoute
  } = cliArgs.values;

  const pagePaddings = paddings ? `@page { padding: ${paddings} }` : '';
  const userStylesPromise = styles ? getFileContent(styles) : '';
  const followingHtmlPromise = followingRoute
    ? getFileContent(followingRoute)
    : '';
  const precedingHtmlPromise = precedingRoute
    ? getFileContent(precedingRoute)
    : '';

  const [userStyles, followingHtml, precedingHtml] = await Promise.all([
    userStylesPromise,
    followingHtmlPromise,
    precedingHtmlPromise
  ]);

  const body = `<base href="${baseOrigin}" />
                <style>
                  aside,
                  code,
                  figure,
                  pre {
                    break-inside: avoid !important;
                  }

                  .${CLASSNAMES.pageBreak} {
                    break-after: page;
                  }

                  ${userStyles}
                  ${pagePaddings}
                </style>
                ${precedingHtml}
                ${contents}
                <div class=${CLASSNAMES.mainContainer}>${htmlContent}</div>
                ${followingHtml}
               `;

  return body;
}

export default composeBody;
