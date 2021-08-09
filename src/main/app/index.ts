import express from 'express';

import { setupMiddlewares } from '@/main/middlewares';
import { setupRoutes } from '@/main/routes';

const app = express();

setupMiddlewares(app);
setupRoutes(app);

export { app };
