export class RequiredFieldError extends Error {
  constructor(fieldName?: string) {
    super(fieldName ? `The field ${fieldName} is required` : 'Field required');

    this.name = 'RequiredFieldError';
  }
}

export class InvalidMimeTypeError extends Error {
  constructor(allowed: string[]) {
    super(`Unsupported mime type. allowed: ${allowed.join(',')}`);

    this.name = 'InvalidMimeTypeError';
  }
}

export class MaxFileSizeError extends Error {
  constructor(maxSizeInMb: number) {
    super(`File upload limit is ${maxSizeInMb} mb`);

    this.name = 'MaxFileSizeError';
  }
}
