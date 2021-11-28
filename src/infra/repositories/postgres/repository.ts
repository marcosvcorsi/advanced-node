import { ObjectType, Repository } from 'typeorm';

import { PgConnection } from './helpers';

export abstract class PgRepository {
  constructor(
    protected readonly connection: PgConnection = PgConnection.getInstance(),
  ) { }

  getRepository<T>(entity: ObjectType<T>): Repository<T> {
    return this.connection.getRepository<T>(entity);
  }
}
