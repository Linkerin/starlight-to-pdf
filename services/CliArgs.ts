import { parseArgs } from 'util';

import type { CliValue, CliValuesObj } from '../lib/types/cli.types';
import parsers from '../utils/parsers';
import { ValidationError } from './Errors';
import validators from '../utils/validators';

const cliOptions = {
  url: {
    validate: validators.isUrl,
    parse: parsers.url
  },
  'browser-executable': {
    validate: validators.isPath
  },
  'contents-name': {
    validate: validators.isString
  },
  'css-page-size': {
    validate: validators.isBoolean
  },
  exclude: {
    validate: validators.isExclude,
    parse: parsers.exclude
  },
  filename: {
    validate: validators.isFilename
  },
  'following-html': {
    validate: validators.isHtmlFile
  },
  footer: {
    validate: validators.isHtmlFile
  },
  format: {
    validate: validators.isFormat
  },
  header: {
    validate: validators.isHtmlFile
  },
  help: {
    validate: validators.isBoolean
  },
  last: {
    validate: validators.isString,
    parse: parsers.lastPage
  },
  margins: {
    validate: validators.isSpacing,
    parse: parsers.margins
  },
  'no-contents': {
    validate: validators.isBoolean
  },
  paddings: {
    validate: validators.isSpacing
  },
  path: {
    validate: validators.isPath
  },
  'pdf-outline': {
    validate: validators.isBoolean
  },
  'preceding-html': {
    validate: validators.isHtmlFile
  },
  'print-bg': {
    validate: validators.isBoolean
  },
  styles: {
    validate: validators.isStylesFile
  },
  timeout: {
    validate: validators.isString,
    parse: parsers.timeout
  },
  version: {
    validate: validators.isBoolean
  }
};

class CliArgs {
  private _values: CliValuesObj = {};
  private _positionals;

  constructor() {
    try {
      const { values, positionals } = parseArgs({
        args: process.argv,
        options: {
          url: {
            type: 'string',
            short: 'u'
          },
          'browser-executable': {
            type: 'string'
          },
          'contents-name': {
            type: 'string'
          },
          'css-page-size': {
            type: 'boolean'
          },
          exclude: {
            type: 'string',
            short: 'e',
            multiple: true
          },
          filename: {
            type: 'string',
            short: 'f'
          },
          'following-html': {
            type: 'string'
          },
          footer: {
            type: 'string'
          },
          format: {
            type: 'string'
          },
          header: {
            type: 'string'
          },
          help: {
            type: 'boolean',
            short: 'h'
          },
          last: {
            type: 'string',
            short: 'l'
          },
          margins: {
            type: 'string'
          },
          'no-contents': {
            type: 'boolean'
          },
          paddings: {
            type: 'string'
          },
          path: {
            type: 'string',
            short: 'p'
          },
          'pdf-outline': {
            type: 'boolean',
            default: false
          },
          'preceding-html': {
            type: 'string'
          },
          'print-bg': {
            type: 'boolean'
          },
          styles: {
            type: 'string'
          },
          timeout: {
            type: 'string'
          },
          version: {
            type: 'boolean',
            short: 'v'
          }
        },
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

      // `url` is always the first key for processing
      const valueKeys = Object.keys(values).sort((a, b) =>
        a === 'url' ? -1 : b === 'url' ? 1 : 0
      ) as CliValue[];

      for (const key of valueKeys) {
        const value = values[key];
        if (!value) continue;

        const isValid = cliOptions[key].validate(value, key);
        if (!isValid) {
          throw new ValidationError(`Invalid value provided for \`--${key}\`.`);
        }

        switch (key) {
          case 'url':
            this._values.url = cliOptions.url.parse(value as string);
            break;

          case 'exclude':
            this._values.exclude = cliOptions.exclude.parse(
              value as string[],
              this._values.url
            );
            break;

          case 'last':
            this._values.last = cliOptions.last.parse(
              value as string,
              this._values.url
            );
            break;

          case 'margins':
            this._values.margins = cliOptions.margins.parse(value as string);
            break;

          case 'timeout':
            this._values.timeout = cliOptions.timeout.parse(value as string);
            break;

          default:
            this._values[key] = value as any;
            break;
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

  get values() {
    return this._values;
  }

  get positionals(): string[] {
    return this._positionals;
  }
}

export default CliArgs;
