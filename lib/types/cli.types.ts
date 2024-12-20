import type parsers from '../../utils/cliArgParsers';

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

type ParsersObj = typeof parsers;

type ParserReturnType<K extends keyof ParsersObj> = ReturnType<ParsersObj[K]>;

type ParsedValue<
  T extends CliOption[keyof CliOption],
  K extends keyof CliOption
> = K extends keyof ParsersObj
  ? ParserReturnType<K>
  : T extends { type: 'boolean' }
  ? boolean
  : string;

export type CliValuesObj = {
  [K in keyof CliOption]: ParsedValue<CliOption[K], K>;
};

export type CliOption = {
  [K in CliValue]: {
    type: 'string' | 'boolean';
    short?: string;
    validate: (value: unknown, key: string) => boolean;
    parse?: K extends keyof ParsersObj ? ParsersObj[K] : undefined;
  };
};
