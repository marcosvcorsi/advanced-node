import {
  Connection,
  createConnection,
  getConnection,
  getConnectionManager,
  getRepository,
  ObjectType,
  QueryRunner,
  Repository,
} from 'typeorm';

import { DbTransaction } from '@/application/contracts';

import { TransactionNotFoundError } from '.';
import { ConnectionNotFoundError } from './errors';

export class PgConnection implements DbTransaction {
  private static instance?: PgConnection;
  private connection?: Connection;
  private query?: QueryRunner;

  private constructor() {}

  static getInstance(): PgConnection {
    if (!PgConnection.instance) {
      PgConnection.instance = new PgConnection();
    }

    return PgConnection.instance;
  }

  async connect(): Promise<void> {
    this.connection = getConnectionManager().has('default')
      ? getConnection()
      : await createConnection();
  }

  async disconnect(): Promise<void> {
    if (!this.connection) {
      throw new ConnectionNotFoundError();
    }

    await getConnection().close();

    this.query = undefined;
    this.connection = undefined;
  }

  async openTransaction(): Promise<void> {
    if (!this.connection) {
      throw new ConnectionNotFoundError();
    }

    this.query = this.connection.createQueryRunner();

    await this.query.startTransaction();
  }

  async closeTransaction(): Promise<void> {
    if (!this.query) {
      throw new TransactionNotFoundError();
    }

    await this.query.release();
  }

  async commit(): Promise<void> {
    if (!this.query) {
      throw new TransactionNotFoundError();
    }

    await this.query.commitTransaction();
  }

  async rollback(): Promise<void> {
    if (!this.query) {
      throw new TransactionNotFoundError();
    }

    await this.query.rollbackTransaction();
  }

  getRepository<T>(entity: ObjectType<T>): Repository<T> {
    if (!this.connection) {
      throw new ConnectionNotFoundError();
    }

    if (this.query) {
      return this.query.manager.getRepository(entity);
    }

    return getRepository(entity);
  }
}
