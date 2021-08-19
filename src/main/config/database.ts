import { ConnectionOptions } from 'typeorm';

export const connectionOptions: ConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  database: 'advanced-node',
  password: 'docker',
  entities: ['dist/infra/postgres/entities/index.js'],
};
