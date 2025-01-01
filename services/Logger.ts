import yoctoSpinner, { type Spinner } from 'yocto-spinner';

type Tag = 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';

class Logger {
  private _spinner: Spinner;
  constructor() {
    const spinner = yoctoSpinner();
    spinner.color = 'cyan';
    this._spinner = spinner.clear();
  }

  private _resetStyles: string = '\x1b[0m';

  private _infoStyles: string = '\x1b[36m%s' + this._resetStyles; // cyan

  private _errorStyles: string = '\x1b[1;41;37m%s' + this._resetStyles; // white on light red

  private _warnStyles: string = '\x1b[33m%s' + this._resetStyles; // yellow

  private _successStyles: string = '\x1b[32m%s' + this._resetStyles; // green

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
