import { AuthenticationMiddleware } from '@/application/middlewares';
import { setupAuthorize } from '@/domain/use-cases';

import { makeJwtTokenHandler } from '../crypto';

export const makeAuthenticationMiddleware = (): AuthenticationMiddleware => {
  const jwtTokenHandler = makeJwtTokenHandler();

  const authorize = setupAuthorize(jwtTokenHandler);

  return new AuthenticationMiddleware(authorize);
};
