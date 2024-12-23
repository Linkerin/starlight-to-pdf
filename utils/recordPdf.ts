import { existsSync } from 'fs';
import { mkdir } from 'fs/promises';
import path from 'path';
import type { Page, PaperFormat, PDFOptions } from 'puppeteer';
import type { Spinner } from 'yocto-spinner';

import type CliArgs from '../services/CliArgs';
import errorCatcher from './errorCatcher';
import logger from '../services/logger';
import { ParsingError } from '../services/Errors';

interface RecordPdfParams {
  cliArgs: CliArgs;
  hostname: string;
  page: Page;
  spinner: Spinner;
}

async function recordPdf({
  cliArgs,
  hostname,
  page,
  spinner
}: RecordPdfParams) {
  logger.info('Generating PDF. Please wait.');
  spinner.start();

  const filename = `${cliArgs.values.filename ?? hostname}.pdf`;
  const margins = cliArgs.values.margins?.split(' ') ?? [
    '1cm',
    '1cm',
    '1cm',
    '1.5cm'
  ];
  const dirPath = path.resolve(path.normalize(cliArgs.values.path ?? './'));
  // check that the directory exists or create it
  if (!existsSync(dirPath)) {
    const [mkdirError] = await errorCatcher(mkdir(dirPath));
    if (mkdirError) {
      throw new ParsingError(
        `Couldn't create the PDF target directory: '${dirPath}'. The program aborts.`,
        { originalErrorMessage: mkdirError.message }
      );
    }

    spinner.stop();
    logger.info(`Created the PDF target directory: '${dirPath}'.`);
    spinner.start();
  }

  const pdfOptions: PDFOptions = {
    path: path.resolve(dirPath, filename),
    format: (cliArgs.values.format as PaperFormat) ?? 'A4',
    printBackground: Boolean(cliArgs.values['print-bg']),
    margin: {
      top: margins[0],
      right: margins[1],
      bottom: margins[2],
      left: margins[3]
    },
    outline: cliArgs.values['pdf-outline'] ?? false
  };

  const [error] = await errorCatcher(page.pdf(pdfOptions));

  if (error) {
    throw new ParsingError(
      `PDF generation failed. Target directory: ${pdfOptions.path}.`,
      { originalErrorMessage: error.message }
    );
  }

  spinner.stop();
  logger.success(`PDF file was generated and saved to '${pdfOptions.path}'.\n`);

  return pdfOptions;
}

export default recordPdf;
