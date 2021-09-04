import { AuthenticationMiddleware } from '@/application/middlewares';
import { makeJwtTokenHandler } from '@/main/factories/gateways';

export const makeAuthenticationMiddleware = (): AuthenticationMiddleware => {
  const jwtTokenHandler = makeJwtTokenHandler();

  return new AuthenticationMiddleware(jwtTokenHandler.validate.bind(jwtTokenHandler));
};
