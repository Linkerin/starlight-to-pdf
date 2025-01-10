import type { PDFMargin } from 'puppeteer';

export type CliValuesObj = {
  url?: URL;
  'contents-name'?: string;
  'css-page-size'?: boolean;
  exclude?: Set<string>;
  filename?: string;
  footer?: string;
  format?: string;
  header?: string;
  help?: boolean;
  last?: string;
  margins?: PDFMargin;
  'no-contents'?: string;
  paddings?: string;
  path?: string;
  'pdf-outline'?: boolean;
  'print-bg'?: boolean;
  styles?: string;
  timeout?: number;
  version?: boolean;
};

export type CliValue = keyof CliValuesObj;
