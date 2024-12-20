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

  exclude: (value: string, url?: string): Set<string> => {
    const excludeValues = value.split(', ');
    if (!url) {
      throw new ValidationError('Base URL is required to parse excludes');
    }

    const urlObj = parsers.url(url);
    const excludeUrls: Set<string> = new Set();

    for (const excludeValue of excludeValues) {
      if (!URL.canParse(excludeValue, urlObj)) {
        throw new ValidationError(
          `Invalid URL path as exclude value: '${excludeValue}'.`
        );
      }

      const excludeUrl = new URL(excludeValue, urlObj);
      const href =
        excludeUrl.href.at(-1) === '/'
          ? excludeUrl.href
          : excludeUrl.href + '/';
      excludeUrls.add(href);
    }

    return excludeUrls;
  }
};

export default parsers;
