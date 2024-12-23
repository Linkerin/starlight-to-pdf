class Logger {
  private _resetStyles: string = '\x1b[0m';

  private _infoStyles: string = '\x1b[36m%s' + this._resetStyles; // cyan

  private _errorStyles: string = '\x1b[1;41;37m%s' + this._resetStyles; // white on light red

  private _warnStyles: string = '\x1b[33m%s' + this._resetStyles; // yellow

  private _successStyles: string = '\x1b[32m%s' + this._resetStyles; // green

  public info(message: string): void {
    console.log(this._infoStyles, '[INFO]:', message);
  }

  public error(message: string): void {
    console.log(this._errorStyles, '[ERROR]:', message);
  }

  public warn(message: string): void {
    console.log(this._warnStyles, '[WARN]:', message);
  }

  public success(message: string): void {
    console.log(this._successStyles, '[SUCCESS]:', message);
  }
}

const logger = new Logger();

export default logger;
