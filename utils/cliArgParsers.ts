import logger from '../services/Logger';
import { ValidationError } from '../services/Errors';

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
        `Protocol is not specified. Defaulting to HTTPS. Resulting URL: ${userUrl}`
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
        if (!URL.canParse(excludeValue, origin)) {
          throw new ValidationError(
            `Invalid URL path as exclude value: '${excludeValue}'.`
          );
        }

        const excludeUrl = new URL(excludeValue, origin);
        const href =
          excludeUrl.href.at(-1) === '/'
            ? excludeUrl.href
            : excludeUrl.href + '/';
        excludeUrls.add(href);
      }
    }

    return excludeUrls;
  }
};

export default parsers;
