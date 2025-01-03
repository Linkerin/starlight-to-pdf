import { CLASSNAMES } from '../lib/constants';
import type CliArgs from '../services/CliArgs';
import { cliColor, cliTextStyle } from './cliStylings';
import type { Contents, GetAllContentReturn } from '../lib/types/common.types';
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

  const result = `<ul>${contentsHtml}</ul>`;

  return result;
}

function createContents(contentData: Contents[], cliArgs: CliArgs): string {
  const list = composeListEl(contentData);
  const defaultContentsName = 'Contents';
  const contentsName = cliArgs.values['contents-name'] ?? defaultContentsName;

  logger.info(
    `Created table of contents.${
      contentsName !== defaultContentsName
        ? ` User defined name: ${cliColor(
            cliTextStyle(contentsName, 'bold'),
            'yellow'
          )}`
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

function composeBody({
  baseOrigin,
  cliArgs,
  contentsData,
  htmlContent
}: ComposeBodyParams): string {
  const contents = createContents(Array.from(contentsData), cliArgs);

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
                  </style>
                  ${cliArgs.values['no-contents'] ? '' : contents}
                  ${
                    cliArgs.values.paddings
                      ? `<style>@page { padding: ${cliArgs.values.paddings} }</style>`
                      : ''
                  }
                  ${htmlContent}
               `;

  return body;
}

export default composeBody;
