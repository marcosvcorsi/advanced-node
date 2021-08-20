import './config/module-alias';

import 'reflect-metadata';

import 'dotenv/config';
import { createConnection } from 'typeorm';

import { app } from '@/main/app';
import { connectionOptions } from '@/main/config/database';
import { env } from '@/main/config/env';

createConnection(connectionOptions)
  .then(() => app.listen(env.port, () => console.log(`Server is running at ${env.port}`)))
  .catch(console.error);
