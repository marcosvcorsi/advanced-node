import { Router } from 'express';

import { adaptExpressRouter, adaptMulter } from '../adapters';
import { makeSaveProfilePictureController } from '../factories/controllers';
import { auth } from '../middlewares/authentication';

export default (router: Router): void => {
  const controller = makeSaveProfilePictureController();

  router.delete('/users/picture', auth, adaptExpressRouter(controller));
  router.put('/users/picture', auth, adaptMulter, adaptExpressRouter(controller));
};
