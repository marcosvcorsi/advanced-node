import './config/module-alias';

import 'reflect-metadata';

import { app } from '@/main/app';
import { env } from '@/main/config/env';

app.listen(env.port, () => console.log(`Server is running at ${env.port}`));
