import { logger } from '../services/Logger';

function createBaseUrl(url: string): URL | null {
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
}

export default createBaseUrl;
