import { existsSync } from "fs";
import { mkdir } from "fs/promises";
import path from "path";
import type { Page, PaperFormat, PDFOptions } from "puppeteer";

import type CliArgs from "./CliArgs";
import errorCatcher from "./errorCatcher";
import logger from "./logger";

interface RecordPdfParams {
  cliArgs: CliArgs;
  hostname: string;
  page: Page;
}

async function recordPdf({ cliArgs, hostname, page }: RecordPdfParams) {
  logger.info("Generating PDF. Please wait.");

  const filename = `${cliArgs.values.filename ?? hostname}.pdf`;
  const margins = cliArgs.values.margins?.split(" ") ?? [
    "1cm",
    "1cm",
    "1cm",
    "1.5cm",
  ];
  const dirPath = path.resolve(path.normalize(cliArgs.values.path ?? "./"));
  // check that the directory exists or create it
  if (!existsSync(dirPath)) {
    const [mkdirError] = await errorCatcher(mkdir(dirPath));
    if (mkdirError) {
      logger.error(
        `Couldn't create the PDF target directory: '${dirPath}'. The program aborts.`,
      );
      logger.error(`Error: ${mkdirError.message}`);
      process.exit(1);
    }

    logger.info(`Created the PDF target directory: '${dirPath}'.`);
  }

  const pdfOptions: PDFOptions = {
    path: path.resolve(dirPath, filename),
    format: (cliArgs.values.format as PaperFormat) ?? "A4",
    printBackground: Boolean(cliArgs.values["print-bg"]),
    margin: {
      top: margins[0],
      right: margins[1],
      bottom: margins[2],
      left: margins[3],
    },
  };

  const [error] = await errorCatcher(page.pdf(pdfOptions));

  if (error) {
    logger.error(`PDF generation failed. Error: ${error.message}`);
    logger.error(`Target directory: ${pdfOptions.path}`);
    process.exit(1);
  }

  logger.success(`PDF file was generated and saved to '${pdfOptions.path}'.\n`);

  return pdfOptions;
}

export default recordPdf;
