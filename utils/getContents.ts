import type CliArgs from "./CliArgs";
import logger from "./logger";

export interface Contents {
  heading: string;
  url: string;
  children?: Omit<Contents, "children">[];
}

function composeListEl(contentData: Contents[]): string {
  let contentsHtml = "";

  contentData.forEach((value) => {
    contentsHtml += `<li><a href="${value.url}">${value.heading}</a>`;
    if (value.children) {
      contentsHtml += composeListEl(value.children);
    }

    contentsHtml += `</li>`;
  });

  const result = `<ul>${contentsHtml}</ul>`;

  return result;
}

function getContents(contentData: Contents[], cliArgs: CliArgs): string {
  const list = composeListEl(contentData);
  const defaultContentsName = "Contents";
  const contentsName = cliArgs.values["contents-name"] ?? defaultContentsName;

  logger.info(
    `Created table of contents.${
      contentsName !== defaultContentsName
        ? ` User defined name: '${contentsName}'`
        : ""
    }`,
  );

  return `<div class="sl-markdown-content s2pdf-contents" style="break-after: page;">
            <h2>${contentsName}</h2>
            ${list}
          </div>`;
}

export default getContents;
