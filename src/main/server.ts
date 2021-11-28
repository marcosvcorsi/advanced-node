import './config/module-alias';
import 'reflect-metadata';
import 'dotenv/config';

import { PgConnection } from '@/infra/repositories/postgres/helpers';
import { env } from '@/main/config/env';

const bootstrap = async () => {
  try {
    await PgConnection.getInstance().connect();

    const { app } = await import('@/main/app');

    app.listen(env.port, () => console.log(`Server is running at ${env.port}`));
  } catch (error) {
    console.error(error);
  }
};

bootstrap();
