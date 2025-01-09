import type { PaperFormat } from 'puppeteer';
import { sep } from 'path';

import { basePaperFormats, PAPER_FORMATS } from '../lib/constants';
import { ValidationError } from '../services/Errors';

const invalidChars = /[<>:"|?*]/; // Windows-specific characters
const illegalNames = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i; // Windows reserved names

function isProperExtension(fileName: string, extension: string): boolean {
  const fileExtension = fileName.split('.').at(-1);

  if (fileExtension !== extension) {
    throw new ValidationError(
      `Invalid file provided: '${fileName}'. Expected \`*.${extension}\` file.`
    );
  }

  return true;
}

const validators = {
  isBoolean(value: unknown, key: string): value is boolean {
    if (typeof value !== 'boolean') {
      throw new ValidationError(`\`--${key}\` is a boolean argument.`);
    }

    return true;
  },

  isString(value: unknown, key: string): value is string {
    if (typeof value !== 'string') {
      throw new ValidationError(
        `For \`--${key}\` argument value must be a string.`
      );
    }

    return true;
  },

  isExclude(value: unknown, key: string): value is string[] {
    if (!Array.isArray(value)) {
      throw new ValidationError(`\`--${key}\` values must result in an array.`);
    }

    for (const element of value) {
      if (!validators.isString(element, key)) return false;
    }

    return true;
  },

  isFilename(name: unknown, key: string): name is string {
    if (!validators.isString(name, key)) return false;

    if (name.trim() === '') {
      throw new ValidationError(
        `\`--${key}\` argument value must be a non-empty string.`
      );
    }

    if (invalidChars.test(name) || illegalNames.test(name)) {
      throw new ValidationError(
        `Invalid \`--${key}\` value. Provided: '${name}' `
      );
    }

    return true;
  },

  isFormat(format: unknown, key: string): format is PaperFormat {
    if (!validators.isString(format, key)) return false;

    if (!PAPER_FORMATS.has(format)) {
      throw new ValidationError(
        `Invalid format value provided: '${format}'.\nAllowed values: '${basePaperFormats.join(
          "', '"
        )}'.`
      );
    }

    return true;
  },

  isHtmlFile(value: unknown, key: string): boolean {
    if (!validators.isPath(value, key)) return false;
    if (!isProperExtension(value, 'html')) return false;

    return true;
  },

  isPath(value: unknown, key: string): value is string {
    if (!validators.isString(value, key)) return false;

    if (value.trim() === '') {
      throw new ValidationError(
        `\`--${key}\` argument value must be a non-empty string.`
      );
    }

    const pathParts = value.split(sep);

    for (const part of pathParts) {
      if (invalidChars.test(part) || illegalNames.test(part)) {
        throw new ValidationError(
          `\`--${key}\` value contains invalid part: ${part}`
        );
      }
    }

    // Ensures the path doesn't have null bytes
    if (value.includes('\0')) {
      throw new ValidationError(`\`--${key}\` value contains null byte.`);
    }

    return true;
  },

  isSpacing(values: unknown, key: string): boolean {
    if (!validators.isString(values, key)) return false;

    const spacingValues = values.split(' ');
    if (spacingValues.length !== 4) {
      throw new ValidationError(
        `For \`--${key}\` argument must be four values separated by spaces.`
      );
    }

    const spacingRegex = /^\d+(\.\d+)?(mm|in|cm|px|pt|pc)?$/;
    for (const spacing of spacingValues) {
      if (!spacing.match(spacingRegex)) {
        throw new ValidationError(
          `Invalid margin value provided: '${spacing}'.`
        );
      }
    }

    return true;
  },

  isStylesFile(value: unknown, key: string): boolean {
    if (!validators.isPath(value, key)) return false;
    if (!isProperExtension(value, 'css')) return false;

    return true;
  },

  isUrl(value: unknown, key: string): boolean {
    if (!validators.isString(value, key)) return false;

    const urlRegex =
      /^(https?:\/\/)?((([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})|(localhost)|(\d{1,3}(\.\d{1,3}){3}))(:\d+)?(\/[^\s]*)?$/;

    if (!value.match(urlRegex)) {
      throw new ValidationError(`Invalid URL provided: '${value}'.`);
    }

    return true;
  }
};

export default validators;
