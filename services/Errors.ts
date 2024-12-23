interface AdditionalInfo {
  originalErrorMessage?: string;
}

export class ValidationError extends Error {
  additionalInfo?: AdditionalInfo;
  constructor(message: string, additionalInfo?: AdditionalInfo) {
    super(message);
    this.name = 'ValidationError';
    this.additionalInfo = additionalInfo;
  }
}

export class ParsingError extends Error {
  additionalInfo?: AdditionalInfo;
  constructor(message: string, additionalInfo?: AdditionalInfo) {
    super(message);
    this.name = 'ParsingError';
    this.additionalInfo = additionalInfo;
  }
}
