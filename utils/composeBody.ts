import path from 'path';
import { readFile } from 'fs/promises';

import { CLASSNAMES } from '../lib/constants';
import type CliArgs from '../services/CliArgs';
import { cliColor, cliLink, cliTextStyle } from './cliStylings';
import type { Contents, GetAllContentReturn } from '../lib/types/common.types';
import { logger } from '../services/Logger';
import { ParsingError } from '../services/Errors';

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

async function getStyles(fileRoute: string): Promise<string> {
  if (!fileRoute) {
    throw new ParsingError('Provided invalid filepath for custom CSS styles.')
  }

  const filePath = path.resolve(path.normalize(fileRoute));
  try {
    const stylesContent = await readFile(filePath, 'utf-8')

    return stylesContent
    
  } catch (err) {
    const errMsg = `Could not read styles content from '${cliLink(filePath)}'.`

    if (err instanceof Error) {
      throw new ParsingError(errMsg, {originalErrorMessage: err.message})
    } else {
      throw new ParsingError(errMsg)
    }
  }
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
  
  const {styles} = cliArgs.values;
  const userStyles = styles ? await getStyles(styles): ''

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
                  </style>
                  ${
                    cliArgs.values.paddings
                      ? `<style>@page { padding: ${cliArgs.values.paddings} }</style>`
                      : ''
                  }
                  ${contents}
                  ${htmlContent}
               `;

  return body;
}

export default composeBody;
