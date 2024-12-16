import logger from "./logger";

function getBaseUrl(url: string): [undefined, URL] | [Error] {
  const httpRegex = /^(https?:\/\/)/;
  const match = url.match(httpRegex);

  let userUrl = url;

  if (!match) {
    userUrl = "https://" + url;
    logger.warn(
      `Protocol is not specified. Defaulting to HTTPS. Resulting url: ${userUrl}`,
    );
  }

  try {
    const urlObj = new URL(userUrl);

    return [undefined, urlObj];
  } catch (e) {
    if (!(e instanceof Error)) {
      throw e;
    }

    return [e];
  }
}

export default getBaseUrl;
