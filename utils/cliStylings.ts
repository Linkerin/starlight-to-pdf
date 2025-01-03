import type { CliColor } from '../lib/types/common.types';
import { CLI_STYLES } from '../lib/constants';

const { escapeSeq, color: colorStyles, reset } = CLI_STYLES;

interface CliColorOptions {
  bg?: boolean;
  bright?: boolean;
}

export function cliColor(
  text: unknown,
  color: CliColor,
  options: CliColorOptions = {}
): string {
  const { bg, bright } = options;
  let prefix: string;

  if (bg) {
    prefix = bright ? colorStyles.brightBg : colorStyles.bg;
  } else {
    prefix = bright ? colorStyles.brightFg : colorStyles.fg;
  }

  const result = `${escapeSeq}${prefix}${colorStyles[color]}m${text}${reset}`;

  return result;
}

export function cliTextStyle(
  text: unknown,
  style: 'bold' | 'underline'
): string {
  const styling = style === 'bold' ? CLI_STYLES.bold : CLI_STYLES.underline;

  return `${escapeSeq}${styling}m${text}${reset}`;
}

export function cliLink(link: string): string {
  const result = cliColor(cliTextStyle(link, 'underline'), 'blue');

  return result;
}
