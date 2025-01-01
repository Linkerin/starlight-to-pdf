import type { Page } from 'puppeteer';

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
