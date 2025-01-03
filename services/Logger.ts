import yoctoSpinner, { type Spinner } from 'yocto-spinner';

import { CLI_STYLES } from '../lib/constants';

type Tag = 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';

const { escapeSeq, reset, bold, color } = CLI_STYLES;

class Logger {
  private _spinner: Spinner;
  constructor() {
    const spinner = yoctoSpinner();
    spinner.color = 'cyan';
    this._spinner = spinner.clear();
  }

  private _resetStyles: string = reset;

  private _infoStyles: string =
    `${escapeSeq}${color.fg}${color.cyan}m%s` + this._resetStyles; // cyan

  private _errorStyles: string =
    `${escapeSeq}${bold};${color.fg}${color.white};${color.bg}${color.red}m%s` +
    this._resetStyles; // white on light red

  private _warnStyles: string =
    `${escapeSeq}${color.fg}${color.yellow}m%s` + this._resetStyles; // yellow

  private _successStyles: string =
    `${escapeSeq}${color.fg}${color.green}m%s` + this._resetStyles; // green

  private _logMessage(tag: Tag, ...args: unknown[]): void {
    let styles: string;

    switch (tag) {
      case 'INFO':
        styles = this._infoStyles;
        break;
      case 'WARN':
        styles = this._warnStyles;
        break;
      case 'ERROR':
        styles = this._errorStyles;
        break;
      case 'SUCCESS':
        styles = this._successStyles;
        break;
      default:
        styles = this._infoStyles;
        break;
    }

    this._spinner.stop();
    console.log(styles, `[${tag}]:`, ...args);

    if (tag !== 'ERROR') {
      this._spinner.start();
    }
  }

  public start() {
    this._spinner.start();
  }

  public stop() {
    this._spinner.stop();
  }

  public isSpinning(): boolean {
    return this._spinner.isSpinning;
  }

  public info(...message: any[]): void {
    this._logMessage('INFO', ...message);
  }

  public error(...message: any[]): void {
    this._logMessage('ERROR', ...message);
  }

  public warn(...message: any[]): void {
    this._logMessage('WARN', ...message);
  }

  public success(...message: any[]): void {
    this._logMessage('SUCCESS', ...message);
  }
}

export const logger = new Logger();

export default Logger;
