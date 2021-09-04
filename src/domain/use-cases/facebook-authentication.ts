import { LoadFacebookUser, TokenGenerator } from '@/domain/contracts/gateways';
import { SaveFacebookAccountRepository, LoadUserAccountRepository } from '@/domain/contracts/repositories';
import { AccessToken, FacebookAccount } from '@/domain/entities';
import { AuthenticationError } from '@/domain/errors';

type Input = {
  token: string;
}

type Output = {
  accessToken: string;
}

export type FacebookAuthentication = (params: Input) => Promise<Output>;

type Setup = (
  facebook: LoadFacebookUser,
  userAccountRepository: LoadUserAccountRepository & SaveFacebookAccountRepository,
  token: TokenGenerator,
) => FacebookAuthentication;

export const setupFacebookAuthentication: Setup = (
  facebook,
  userAccountRepository,
  token,
) => async (params) => {
  const fbData = await facebook.loadUser(params);

  if (!fbData) {
    throw new AuthenticationError();
  }

  const userAccountData = await userAccountRepository.load({ email: fbData.email });

  const fbAccount = new FacebookAccount(fbData, userAccountData);

  const { id } = await userAccountRepository.saveWithFacebook(fbAccount);

  const accessToken = await token.generate({
    key: id,
    expirationInMs: AccessToken.expirationInMs,
  });

  return {
    accessToken,
  };
};
