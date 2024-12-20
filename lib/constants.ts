import type { PaperFormat } from 'puppeteer';
import type { PDFMargin } from 'puppeteer';

export const MARGINS: PDFMargin = {
  top: '1cm',
  right: '1cm',
  bottom: '1cm',
  left: '1.5cm'
};

export const CLASSNAMES = {
  contents: 's2pdf-contents',
  heading: 's2pdf-heading',
  mainContainer: 's2pdf-container',
  pageBreak: 's2pdf-pagebreak',

  starlight: {
    markdownContent: 'sl-markdown-content'
  }
} as const;

export const SELECTORS = {
  heading: '*:has(> h1#_top)',
  mainInfo: `.${CLASSNAMES.starlight.markdownContent}`,
  subheading: `.${CLASSNAMES.starlight.markdownContent} h2`,
  nextLink: "a[rel='next']"
} as const;

export const basePaperFormats = [
  'LETTER',
  'LEGAL',
  'TABLOID',
  'LEDGER',
  'A0',
  'A1',
  'A2',
  'A3',
  'A4',
  'A5',
  'A6',
  'Letter',
  'Legal',
  'Tabloid',
  'Ledger'
] as const;

export const PAPER_FORMATS = new Set([
  ...basePaperFormats,
  ...basePaperFormats.map(f => f.toLowerCase())
]);

export const PDF_FORMAT: PaperFormat = 'A4';
