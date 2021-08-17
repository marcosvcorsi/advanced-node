import { Express, Router } from 'express';
import { readdirSync } from 'fs';
import { join } from 'path';

export const setupRoutes = (app: Express) => {
  const router = Router();

  readdirSync(join(__dirname))
    .filter((file) => !file.includes('index') && !file.endsWith('.map'))
    .map(async (file) => {
      (await import(`./${file}`)).default(router);
    });

  app.use('/api', router);
};
