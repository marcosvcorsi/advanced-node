export class ServerError extends Error {
  constructor(error?: Error) {
    super('Internal Server Error');

    this.name = 'ServerError';
    this.stack = error?.stack;
  }
}

export class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized');

    this.name = 'UnauthorizedError';
  }
}
