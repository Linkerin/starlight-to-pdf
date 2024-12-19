import type { Page } from "puppeteer";

import errorCatcher from "./errorCatcher";

async function getNextUrl(page: Page): Promise<URL | null> {
  const [nextLinkError, nextLink] = await errorCatcher(
    page.$eval("a[rel='next']", (el: HTMLAnchorElement) => el.href),
  );

  if (nextLinkError) {
    return null;
  }

  const currentLink = page.url();
  const currentUrl = new URL(currentLink);

  if (nextLink && URL.canParse(nextLink, currentUrl.origin)) {
    const nextUrl = new URL(nextLink, currentUrl.origin);
    return nextUrl;
  }

  return null;
}

export default getNextUrl;
