import { IMemoryDb, newDb } from 'pg-mem';

import { PgConnection } from '@/infra/repositories/postgres/helpers';

export const makeInMemoryDb = async (entities: any[] = []): Promise<IMemoryDb> => {
  const db = newDb();
  const connection = await db.adapters.createTypeormConnection({
    type: 'postgres',
    entities,
  });

  await connection.synchronize();

  await PgConnection.getInstance().connect();

  return db;
};
