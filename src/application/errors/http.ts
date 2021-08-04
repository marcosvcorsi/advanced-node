export class ServerError extends Error {
  constructor(error?: Error) {
    super('Internal Server Error');

    this.name = 'ServerError';
    this.stack = error?.stack;
  }
}

export class RequiredFieldError extends Error {
  constructor(fieldName: string) {
    super(`The field ${fieldName} is required`);

    this.name = 'RequiredFieldError';
  }
}
