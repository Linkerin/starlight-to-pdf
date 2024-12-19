import type { Page } from "puppeteer";

import type { Contents } from "./getContents";
import logger from "./logger";
import getNextUrl from "./getNextUrl";
import errorCatcher from "./errorCatcher";

interface ProcessPageContentReturn {
  contents: Contents;
  html: string;
}

async function processPageContent(
  page: Page,
): Promise<ProcessPageContentReturn> {
  const currentLink = page.url();

  const [error, parsedData] = await errorCatcher(
    page.evaluate((link) => {
      const headingElement = document.querySelector("*:has(> h1#_top)");
      const heading: HTMLElement | null = headingElement
        ? (headingElement as HTMLElement)
        : null;

      const mainInfo = document.querySelector(".sl-markdown-content");
      if (mainInfo) {
        mainInfo.classList.add("s2pdf-pagebreak");
      }
      const subheadingElements = document.querySelectorAll(
        ".sl-markdown-content h2",
      );
      const subheadings = Array.from(subheadingElements) as HTMLElement[];

      return {
        heading: {
          html: heading?.outerHTML ?? "",
          text: heading?.innerText ?? "",
        },
        mainInfo: { html: mainInfo?.outerHTML ?? "" },
        subheadings: subheadings.map((el) => ({
          heading: el.innerText ?? "",
          url: link + "#" + el.getAttribute("id"),
        })),
      };
    }, currentLink),
  );

  if (error) {
    logger.error("Caught error while parsing the page. The program aborts.");
    logger.error(`Error: ${error.message}`);
    process.exit(1);
  }

  const contents: Contents = {
    heading: parsedData.heading.text,
    url: currentLink,
    children: parsedData.subheadings,
  };

  let html = parsedData.heading.html + parsedData.mainInfo.html;

  return { contents, html };
}

interface GetAllContentParams {
  htmlContent: string;
  contentsData: Set<Contents>;
  page: Page;
}

type GetAllContentReturn = Omit<GetAllContentParams, "url" | "page">;

async function getAllContent({
  contentsData,
  htmlContent,
  page,
}: GetAllContentParams): Promise<GetAllContentReturn> {
  logger.info(`Parsing page: ${page.url()}`);

  const { contents, html } = await processPageContent(page);
  contentsData.add(contents);

  const updatedHtmlContent = htmlContent + html;

  const nextUrl = await getNextUrl(page);
  if (!nextUrl) {
    logger.info(
      `All pages were parsed. Total web pages: ${contentsData.size}.\n`,
    );
    return {
      htmlContent: updatedHtmlContent,
      contentsData,
    };
  }

  await page.goto(nextUrl.href, { waitUntil: "domcontentloaded" });

  return getAllContent({
    htmlContent: updatedHtmlContent,
    contentsData: contentsData,
    page,
  });
}

export default getAllContent;
