import { parseArgs } from 'util';

import type { CliOption, CliValue, CliValuesObj } from '../lib/types/cli.types';
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
    validate: validators.isString,
    parse: parsers.exclude
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
    validate: validators.isSpacing
  },
  'no-contents': {
    type: 'boolean',
    validate: validators.isBoolean
  },
  paddings: {
    type: 'string',
    validate: validators.isSpacing
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

// TODO: solve typing issues, they are not properly inferred
class CliArgs {
  private _values: CliValuesObj = {} as CliValuesObj;
  private _positionals;

  constructor() {
    try {
      const { values, positionals } = parseArgs({
        args: process.argv,
        options: Object.entries(cliOptions).reduce((acc, [key, opt]) => {
          acc[key as CliValue] = { type: opt.type };
          if (opt.short) {
            acc[key as CliValue].short = opt.short;
          }
          return acc;
        }, {} as Record<CliValue, Pick<CliOption[keyof CliOption], 'type' | 'short'>>),
        strict: true,
        allowPositionals: true
      });

      if (positionals.length > 3) {
        throw new ValidationError('Too many positional arguments provided.');
      }

      this._positionals = positionals;

      if (!values.url && positionals.at(2)) {
        values.url = positionals.at(2);
      }

      if (!values.url && !values.help && !values.version) {
        throw new ValidationError(
          'URL for parsing is required. Provide `--url` argument value.'
        );
      }

      for (const [key, value] of Object.entries(values)) {
        if (!value) continue;
        const flag = key as CliValue;
        const option = cliOptions[flag];
        const isValid = option.validate(value, key);
        if (!isValid) {
          throw new ValidationError(
            `Invalid value provided for \`--${flag}\`.`
          );
        }

        if (!option.parse) {
          this._values[flag] = value as any;
          continue;
        }

        if (flag === 'exclude') {
          this._values[flag] = option.parse(
            value as string,
            values.url as string
          ) as any;
        } else {
          this._values[flag] = option.parse(value as string) as any;
        }
      }
    } catch (err) {
      if (err instanceof ValidationError) {
        throw err;
      }

      if (err instanceof Error) {
        throw new ValidationError(
          'Arguments parsing failed due to invalid values provided.',
          { originalErrorMessage: err.message }
        );
      }

      throw err;
    }
  }
  get values(): CliValuesObj {
    return this._values;
  }

  get positionals(): string[] {
    return this._positionals;
  }
}

export default CliArgs;
