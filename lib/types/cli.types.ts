export type CliValuesObj = {
  url?: URL;
  'contents-name'?: string;
  exclude?: Set<string>;
  filename?: string;
  format?: string;
  help?: boolean;
  margins?: string;
  'no-contents'?: string;
  paddings?: string;
  path?: string;
  'print-bg'?: boolean;
  version?: boolean;
};

export type CliValue = keyof CliValuesObj;
