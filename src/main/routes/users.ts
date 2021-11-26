import { Router } from 'express';

import { adaptExpressRouter } from '../adapters';
import { makeSaveProfilePictureController } from '../factories/controllers';
import { auth } from '../middlewares/authentication';

export default (router: Router): void => {
  const controller = makeSaveProfilePictureController();

  router.delete('/users/picture', auth, adaptExpressRouter(controller));
};