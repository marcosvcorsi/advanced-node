import { LoadFacebookUserApi } from '@/domain/contracts/apis';
import { TokenGenerator } from '@/domain/contracts/crypto';
import { SaveFacebookAccountRepository, LoadUserAccountRepository } from '@/domain/contracts/repositories';
import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';
import { AccessToken, FacebookAccount } from '@/domain/models';

export class FacebookAuthenticationService implements FacebookAuthentication {
  constructor(
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepository:
      LoadUserAccountRepository & SaveFacebookAccountRepository,
    private readonly crypto: TokenGenerator,
  ) {}

  async perform(params : FacebookAuthentication.Params): Promise<FacebookAuthentication.Result> {
    const fbData = await this.facebookApi.loadUser(params);

    if (!fbData) {
      return new AuthenticationError();
    }

    const userAccountData = await this.userAccountRepository.load({ email: fbData.email });

    const fbAccount = new FacebookAccount(fbData, userAccountData);

    const { id } = await this.userAccountRepository.saveWithFacebook(fbAccount);

    const token = await this.crypto.generateToken({
      key: id,
      expirationInMs: AccessToken.expirationInMs,
    });

    return new AccessToken(token);
  }
}
