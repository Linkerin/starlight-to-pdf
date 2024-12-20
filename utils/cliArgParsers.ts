import logger from './logger';
import type { Spacing } from '../lib/types/cli.types';

const parsers = {
  url: (url: string): URL | null => {
    if (!url) return null;

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
      return null;
    }

    return new URL(userUrl);
  },

  spacings: (value: string): Spacing => {
    const values = value.split(' ');
    return values.map(v => parseFloat(v)) as Spacing;
  },

  margins: (value: string): Spacing => parsers.spacings(value),
  paddings: (value: string): Spacing => parsers.spacings(value)
};

export default parsers;
