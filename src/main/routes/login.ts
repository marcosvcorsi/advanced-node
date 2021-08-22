import { Router } from 'express';

import { adaptExpressRouter } from '@/main/adapters';
import { makeFacebookLoginController } from '@/main/factories/controllers';

export default (router: Router): void => {
  const controller = makeFacebookLoginController();

  router.post('/login/facebook', adaptExpressRouter(controller));
};
