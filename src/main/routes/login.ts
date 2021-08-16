import { Router } from 'express';

import { adaptExpressRouter } from '@/infra/http';
import { makeFacebookLoginController } from '@/main/factories/controllers';

export default (router: Router): void => {
  const controller = makeFacebookLoginController();

  router.post('/api/login/facebook', adaptExpressRouter(controller));
};
