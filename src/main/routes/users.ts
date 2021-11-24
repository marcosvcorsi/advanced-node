import { Router } from 'express';

import { auth } from '../middlewares/authentication';

export default (router: Router): void => {
  router.delete('/users/picture', auth);
};
