import { existsSync } from 'fs';
import { mkdir } from 'fs/promises';
import path from 'path';
import type { Page, PaperFormat, PDFOptions } from 'puppeteer';

import type CliArgs from '../services/CliArgs';
import { cliLink, cliNeutralText } from './cliStylings';
import errorCatcher from './errorCatcher';
import getFileContent from './getFileContent';
import { MARGINS, TIMEOUT_MS } from '../lib/constants';
import { logger } from '../services/Logger';
import { ParsingError } from '../services/Errors';

interface RecordPdfParams {
  cliArgs: CliArgs;
  hostname: string;
  page: Page;
}

async function recordPdf({ cliArgs, hostname, page }: RecordPdfParams) {
  logger.info(cliNeutralText('Generating PDF. Please wait.'));

  const filename = `${cliArgs.values.filename ?? hostname}.pdf`;
  const dirPath = path.resolve(path.normalize(cliArgs.values.path ?? './'));
  // check that the directory exists or create it
  if (!existsSync(dirPath)) {
    const [mkdirError] = await errorCatcher(mkdir(dirPath));
    if (mkdirError) {
      throw new ParsingError(
        `Couldn't create the PDF target directory: ${cliLink(
          dirPath
        )}. The program aborts.`,
        { originalErrorMessage: mkdirError.message }
      );
    }

    logger.info(`Created the PDF target directory: ${cliLink(dirPath)}`);
  }

  const pdfOptions: PDFOptions = {
    path: path.resolve(dirPath, filename),
    format: (cliArgs.values.format as PaperFormat) ?? 'A4',
    printBackground: Boolean(cliArgs.values['print-bg']),
    margin: cliArgs.values.margins ?? MARGINS,
    outline: Boolean(cliArgs.values['pdf-outline']),
    preferCSSPageSize: Boolean(cliArgs.values['css-page-size']),
    timeout: cliArgs.values.timeout ?? TIMEOUT_MS,
    displayHeaderFooter: Boolean(cliArgs.values.header || cliArgs.values.footer)
  };

  if (cliArgs.values.header) {
    pdfOptions.headerTemplate = await getFileContent(cliArgs.values.header);
  }
  if (cliArgs.values.footer) {
    pdfOptions.footerTemplate = await getFileContent(cliArgs.values.footer);
  }

  const [error] = await errorCatcher(page.pdf(pdfOptions));

  if (error) {
    throw new ParsingError(
      `PDF generation failed. Target directory: ${cliLink(
        pdfOptions.path ?? ''
      )}.`,
      { originalErrorMessage: error.message }
    );
  }

  logger.success(
    `PDF file was generated and saved to ${cliLink(pdfOptions.path ?? '')}\n`
  );

  return pdfOptions;
}

export default recordPdf;
