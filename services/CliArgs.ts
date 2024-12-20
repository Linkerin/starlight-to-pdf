import { parseArgs } from 'util';

import type { CliOption, CliValue } from '../lib/types/cli.types';
import parsers from '../utils/cliArgParsers';
import { ValidationError } from './Errors';
import validators from '../utils/validators';

const cliOptions: CliOption = {
  url: {
    type: 'string',
    short: 'u',
    validate: validators.isUrl,
    parse: parsers.url
  },
  'contents-name': {
    type: 'string',
    validate: validators.isString
  },
  exclude: {
    type: 'string',
    short: 'e',
    validate: validators.isString
    // transform: (value: unknown) => (value as string).split(' ')
  },
  filename: {
    type: 'string',
    short: 'f',
    validate: validators.isFilename
  },
  format: {
    type: 'string',
    validate: validators.isFormat
  },
  help: {
    type: 'boolean',
    short: 'h',
    validate: validators.isBoolean
  },
  margins: {
    type: 'string',
    short: 'm',
    validate: validators.isSpacing,
    parse: parsers.margins
  },
  'no-contents': {
    type: 'boolean',
    validate: validators.isBoolean
  },
  paddings: {
    type: 'string',
    validate: validators.isSpacing,
    parse: parsers.paddings
  },
  path: {
    type: 'string',
    short: 'p',
    validate: validators.isPath
  },
  'print-bg': {
    type: 'boolean',
    validate: validators.isBoolean
  },
  version: {
    type: 'boolean',
    short: 'V',
    validate: validators.isBoolean
  }
};

class CliArgsNew {
  private readonly _values: Record<string, any>;
  private readonly _positionals: string[];

  constructor() {
    const { values, positionals } = parseArgs({
      args: process.argv,
      options: Object.entries(cliOptions).reduce((acc, [key, opt]) => {
        acc[key] = { type: opt.type, short: opt.short };
        return acc;
      }, {} as Record<string, Pick<CliOption[keyof CliOption], 'type' | 'short'>>),
      strict: true,
      allowPositionals: true
    });

    if (!values.url && positionals.at(2)) {
      values.url = positionals.at(2);
    }

    if (this._validateArgs(values)) {
      this._values = this._parseValues(values);
      this._positionals = positionals;

      return;
    }

    throw new ValidationError(
      'Arguments parsing failed due to invalid values provided.'
    );
  }

  private _validateArgs(values: Record<string, unknown>): boolean {
    if (this._positionals?.length > 3) {
      throw new ValidationError('Too many positional arguments provided.');
    }

    const positionalUrl = this._positionals?.at(2);
    if (positionalUrl && !validators.isUrl(positionalUrl, 'url')) {
      return false;
    }

    return Object.entries(values).every(([key, value]) => {
      const option = cliOptions[key as CliValue];

      if (option) return option.validate(value, key);

      return false;
    });
  }

  private _parseValues(values: Record<string, unknown>) {
    const transformed: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(values)) {
      const argOption = cliOptions[key as CliValue];
      if (!argOption || !argOption.parse) {
        transformed[key as CliValue] = value;
      } else {
        transformed[key as CliValue] = argOption.parse(value as string);
      }
    }

    return transformed;
  }

  get values() {
    return this._values;
  }

  get positionals(): string[] {
    return this._positionals;
  }
}

export default CliArgsNew;
