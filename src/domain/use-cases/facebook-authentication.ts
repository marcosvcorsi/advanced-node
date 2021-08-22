import { LoadFacebookUserApi } from '@/domain/contracts/apis';
import { TokenGenerator } from '@/domain/contracts/crypto';
import { SaveFacebookAccountRepository, LoadUserAccountRepository } from '@/domain/contracts/repositories';
import { AccessToken, FacebookAccount } from '@/domain/entities';
import { AuthenticationError } from '@/domain/errors';

export type FacebookAuthentication =
  (params: { token: string }) => Promise<{ accessToken: string }>;

type Setup = (
  facebookApi: LoadFacebookUserApi,
  userAccountRepository: LoadUserAccountRepository & SaveFacebookAccountRepository,
  crypto: TokenGenerator,
) => FacebookAuthentication;

export const setupFacebookAuthentication: Setup = (
  facebookApi,
  userAccountRepository,
  crypto,
) => async (params) => {
  const fbData = await facebookApi.loadUser(params);

  if (!fbData) {
    throw new AuthenticationError();
  }

  const userAccountData = await userAccountRepository.load({ email: fbData.email });

  const fbAccount = new FacebookAccount(fbData, userAccountData);

  const { id } = await userAccountRepository.saveWithFacebook(fbAccount);

  const accessToken = await crypto.generateToken({
    key: id,
    expirationInMs: AccessToken.expirationInMs,
  });

  return {
    accessToken,
  };
};
