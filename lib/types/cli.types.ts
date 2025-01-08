export type CliValuesObj = {
  url?: URL;
  'contents-name'?: string;
  exclude?: Set<string>;
  filename?: string;
  format?: string;
  help?: boolean;
  last?: string;
  margins?: string;
  'no-contents'?: string;
  paddings?: string;
  path?: string;
  'pdf-outline'?: boolean;
  'print-bg'?: boolean;
  timeout?: number;
  version?: boolean;
};

export type CliValue = keyof CliValuesObj;
