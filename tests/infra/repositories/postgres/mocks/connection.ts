import { IMemoryDb, newDb } from 'pg-mem';

export const makeInMemoryDb = async (entities: any[] = []): Promise<IMemoryDb> => {
  const db = newDb();
  const connection = await db.adapters.createTypeormConnection({
    type: 'postgres',
    entities,
  });

  await connection.synchronize();

  return db;
};
