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

export const CLI_STYLES = {
  escapeSeq: '\x1b[',
  end: 'm',
  reset: '\x1b[0m',
  bold: '1',
  underline: '4',
  color: {
    fg: '3',
    bg: '4',
    brightFg: '9',
    brightBg: '10',
    black: '0',
    red: '1',
    green: '2',
    yellow: '3',
    blue: '4',
    magenta: '5',
    cyan: '6',
    white: '7'
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

export const TIMEOUT_MS = 180_000; // 3 minutes
