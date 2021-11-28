export class ConnectionNotFoundError extends Error {
  constructor() {
    super('Connection not found');

    this.name = 'ConnectionNotFoundError';
  }
}
