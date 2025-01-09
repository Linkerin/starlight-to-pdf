import type { PDFMargin } from 'puppeteer';

import { cliLink, cliTextStyle } from './cliStylings';
import { logger } from '../services/Logger';
import { ValidationError } from '../services/Errors';

function parseUrlStr(value: string, origin: string): string {
  if (!URL.canParse(value, origin)) {
    throw new ValidationError(`Invalid URL path as exclude value: '${value}'.`);
  }

  const excludeUrl = new URL(value, origin);
  const href =
    excludeUrl.href.at(-1) === '/' ? excludeUrl.href : excludeUrl.href + '/';

  return href;
}

const parsers = {
  url: (url: string): URL => {
    if (!url) {
      throw new ValidationError('URL is required');
    }

    const httpRegex = /^(https?:\/\/)/;
    const match = url.match(httpRegex);

    let userUrl = url;

    if (!match) {
      userUrl = 'https://' + url;
      logger.warn(
        `Protocol is not specified. Defaulting to ${cliTextStyle(
          'HTTPS',
          'bold'
        )}. Resulting URL: ${cliLink(userUrl)}`
      );
    }

    if (!URL.canParse(userUrl)) {
      throw new ValidationError(
        `Can not parse URL. '${userUrl}' is not a valid URL string.`
      );
    }

    return new URL(userUrl);
  },

  exclude: (values: string[], url?: URL): Set<string> => {
    if (!url) {
      throw new ValidationError('Base URL is required to parse excludes');
    }

    if (!values || values.length === 0) {
      throw new ValidationError(
        'Provided excluded URLs resulted in an empty array.'
      );
    }

    const excludeUrls: Set<string> = new Set();
    const origin = url.origin;

    for (const value of values) {
      const excludeValues = value.split(' ');
      for (const excludeValue of excludeValues) {
        const href = parseUrlStr(excludeValue, origin);
        excludeUrls.add(href);
      }
    }

    return excludeUrls;
  },

  lastPage: (value: string, url?: URL): string => {
    if (!url) {
      throw new ValidationError('Base URL is required to parse excludes');
    }

    if (!value) {
      throw new ValidationError('Last page value is required for parsing.');
    }

    const href = parseUrlStr(value, url.origin);

    return href;
  },

  margins: (values: string): PDFMargin => {
    if (!values) {
      throw new ValidationError('Margins value is required for parsing.');
    }

    const marginsArr = values.split(' ');
    if (marginsArr.length !== 4) {
      throw new ValidationError(
        `Margins value must be a string with 4 values separated by space.`
      );
    }

    const result: PDFMargin = {
      top: marginsArr[0],
      right: marginsArr[1],
      bottom: marginsArr[2],
      left: marginsArr[3]
    };

    return result;
  },

  timeout: (timeout: string): number => {
    if (!timeout) {
      throw new ValidationError('Timeout value is required for parsing.');
    }

    const parsedTimeout = parseInt(timeout, 10);

    if (isNaN(parsedTimeout)) {
      throw new ValidationError(
        `Invalid timeout value provided. It must be a string representing a number.`
      );
    }

    return parsedTimeout;
  }
};

export default parsers;
