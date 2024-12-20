import { parseArgs } from 'util';

import validators from './validators';
import { ValidationError } from '../services/Errors';

class CliArgs {
  private _values;
  private _positionals;
  private _url;

  constructor() {
    try {
      const { values, positionals } = parseArgs({
        args: process.argv,
        options: {
          url: {
            type: 'string',
            short: 'u'
          },
          'contents-name': {
            type: 'string'
          },
          exclude: {
            type: 'string',
            short: 'e'
          },
          filename: {
            type: 'string',
            short: 'f'
          },
          format: {
            type: 'string'
          },
          help: {
            type: 'boolean',
            short: 'h'
          },
          margins: {
            type: 'string',
            short: 'm'
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
          'print-bg': {
            type: 'boolean'
          },
          version: {
            type: 'boolean',
            short: 'V'
          }
        },
        strict: true,
        allowPositionals: true
      });

      this._values = values;
      this._positionals = positionals;
    } catch (err) {
      const error = err as Error;
      throw new ValidationError('Invalid argument provided.', {
        originalErrorMessage: error.message
      });
    }

    const checkRes = this._isValidArgs();
    if (!checkRes) {
      throw new ValidationError('Invalid argument provided.');
    }

    this._url = this._values.url ?? this._positionals.at(2);
  }

  get values() {
    return this._values;
  }

  get positionals() {
    return this._positionals;
  }

  get url() {
    return this._url;
  }

  private _isValidArgs() {
    if (this._positionals.length > 3) {
      throw new ValidationError('Too many positional arguments provided.');
    }

    const positionalUrl = this._positionals.at(2);
    if (positionalUrl && !validators.isUrl(positionalUrl, 'url')) return false;

    let result = true;

    for (const [key, value] of Object.entries(this._values)) {
      switch (key as keyof typeof this._values) {
        case 'url':
          result = validators.isUrl(value, key);
          break;

        case 'contents-name':
          result = validators.isString(value, key);
          break;

        case 'filename':
          result = validators.isFilename(value, key);
          break;

        case 'format': {
          result = validators.isFormat(value, key);
          break;
        }

        case 'help':
          result = validators.isBoolean(value, key);
          break;

        case 'margins':
          result = validators.isSpacing(value, key);
          break;

        case 'no-contents':
          result = validators.isBoolean(value, key);
          break;

        case 'paddings':
          result = validators.isSpacing(value, key);
          break;

        case 'path':
          result = validators.isPath(value, key);
          break;

        case 'print-bg':
          result = validators.isBoolean(value, key);
          break;

        case 'version':
          result = validators.isBoolean(value, key);
          break;

        default:
          throw new ValidationError(`Unknown argument: ${key}`);
      }

      if (!result) break;
    }

    return result;
  }
}

export default CliArgs;
