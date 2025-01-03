import type { Page } from 'puppeteer';

export type CliColor =
  | 'red'
  | 'green'
  | 'yellow'
  | 'blue'
  | 'magenta'
  | 'cyan'
  | 'white'
  | 'black';

export interface Contents {
  heading: string;
  url: string;
  children?: Omit<Contents, 'children'>[];
}

export interface GetAllContentParams {
  htmlContent: string;
  contentsData: Set<Contents>;
  page: Page;
  exclude?: Set<string>;
}

export type GetAllContentReturn = Pick<
  GetAllContentParams,
  'contentsData' | 'htmlContent'
>;
