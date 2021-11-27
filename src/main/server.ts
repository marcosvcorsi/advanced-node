import './config/module-alias';

import 'reflect-metadata';

import 'dotenv/config';
import { createConnection, getConnectionOptions } from 'typeorm';

import { env } from '@/main/config/env';

const bootstrap = async () => {
  try {
    const options = await getConnectionOptions();

    const root = process.env.TS_NODE_DEV ? 'src' : 'dist';

    const entities = [`${root}/infra/repositories/postgres/entities/index.{js,ts}`];

    await createConnection({ ...options, entities });

    const { app } = await import('@/main/app');

    app.listen(env.port, () => console.log(`Server is running at ${env.port}`));
  } catch (error) {
    console.error(error);
  }
};

bootstrap();
