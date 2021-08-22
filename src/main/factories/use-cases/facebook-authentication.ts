import { FacebookAuthenticationUseCase } from '@/domain/use-cases';
import { makeFacebookApi } from '@/main/factories/apis';
import { makeJwtTokenGenerator } from '@/main/factories/crypto';
import { makePgUserAccountRepository } from '@/main/factories/repositories';

export const makeFacebookAuthenticationUseCase = (): FacebookAuthenticationUseCase => {
  const facebookApi = makeFacebookApi();

  const pgUserAccountRepository = makePgUserAccountRepository();

  const jwtTokenGenerator = makeJwtTokenGenerator();

  return new FacebookAuthenticationUseCase(
    facebookApi,
    pgUserAccountRepository,
    jwtTokenGenerator,
  );
};
