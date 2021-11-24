import { Router } from 'express';

import { adaptExpressRouter } from '../adapters';
import { makeDeletePictureController } from '../factories/controllers';
import { auth } from '../middlewares/authentication';

export default (router: Router): void => {
  const controller = makeDeletePictureController();

  router.delete('/users/picture', auth, adaptExpressRouter(controller));
};
