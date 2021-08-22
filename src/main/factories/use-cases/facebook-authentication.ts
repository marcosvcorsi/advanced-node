import { FacebookAuthentication, setupFacebookAuthentication } from '@/domain/use-cases';
import { makeFacebookApi } from '@/main/factories/apis';
import { makeJwtTokenGenerator } from '@/main/factories/crypto';
import { makePgUserAccountRepository } from '@/main/factories/repositories';

export const makeFacebookAuthentication = (): FacebookAuthentication => {
  const facebookApi = makeFacebookApi();

  const pgUserAccountRepository = makePgUserAccountRepository();

  const jwtTokenGenerator = makeJwtTokenGenerator();

  return setupFacebookAuthentication(
    facebookApi,
    pgUserAccountRepository,
    jwtTokenGenerator,
  );
};
