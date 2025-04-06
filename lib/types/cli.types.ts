import type { PDFMargin } from 'puppeteer';

export type CliValuesObj = {
  url?: URL;
  'browser-executable'?: string;
  'contents-name'?: string;
  'contents-links'?: 'internal' | 'external';
  'css-page-size'?: boolean;
  exclude?: Set<string>;
  filename?: string;
  'following-html'?: string;
  footer?: string;
  format?: string;
  header?: string;
  help?: boolean;
  last?: string;
  margins?: PDFMargin;
  'no-contents'?: string;
  'no-starlight-print-css'?: boolean;
  paddings?: string;
  'page-wait-until'?: string;
  path?: string;
  'pdf-outline'?: boolean;
  'preceding-html'?: string;
  'print-bg'?: boolean;
  'scroll-delay'?: number;
  styles?: string;
  timeout?: number;
  version?: boolean;
};

export type CliValue = keyof CliValuesObj;
