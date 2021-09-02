import { adaptExpressMiddleware } from '../adapters';
import { makeAuthenticationMiddleware } from '../factories/middlewares/authentication';

const authMiddleware = makeAuthenticationMiddleware();

export const auth = adaptExpressMiddleware(authMiddleware);
