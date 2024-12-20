import type parsers from '../../utils/cliArgParsers';

export type Spacing = [number, number, number, number];

export interface ParsedArgs {
  values: Record<string, any>;
  positionals: string[];
}

export type CliValue =
  | 'url'
  | 'contents-name'
  | 'exclude'
  | 'filename'
  | 'format'
  | 'help'
  | 'margins'
  | 'no-contents'
  | 'paddings'
  | 'path'
  | 'print-bg'
  | 'version';

export type CliOption = {
  [K in CliValue]: {
    type: 'string' | 'boolean';
    short?: string;
    validate: (value: unknown, key: string) => boolean;
    parse?: K extends keyof ParsersObj ? ParsersObj[K] : undefined;
  };
};

// export interface CliValues {
//   url?: string;
//   contentsName?: string;
//   exclude?: string[];
//   filename?: string;
//   format?: PaperFormat;
//   help?: boolean;
//   margins?: Spacing;
//   noContents?: boolean;
//   paddings?: Spacing;
//   path?: string;
//   printBg?: boolean;
//   version?: boolean;
// }

export type ParsersObj = typeof parsers;
