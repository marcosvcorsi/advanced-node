import { FacebookAuthenticationService } from '@/domain/services';
import { makeFacebookApi } from '@/main/factories/apis';
import { makeJwtTokenGenerator } from '@/main/factories/crypto';
import { makePgUserAccountRepository } from '@/main/factories/repositories';

export const makeFacebookAuthenticationService = (): FacebookAuthenticationService => {
  const facebookApi = makeFacebookApi();

  const pgUserAccountRepository = makePgUserAccountRepository();

  const jwtTokenGenerator = makeJwtTokenGenerator();

  return new FacebookAuthenticationService(
    facebookApi,
    pgUserAccountRepository,
    jwtTokenGenerator,
  );
};
