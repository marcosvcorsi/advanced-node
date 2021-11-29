export class ConnectionNotFoundError extends Error {
  constructor() {
    super('Connection not found');

    this.name = 'ConnectionNotFoundError';
  }
}

export class TransactionNotFoundError extends Error {
  constructor() {
    super('Transaction not found');

    this.name = 'TransactionNotFoundError';
  }
}
