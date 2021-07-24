import { LoadFacebookUserApi } from '@/data/contracts/apis';
import { TokenGenerator } from '@/data/contracts/crypto';
import { SaveFacebookAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repositories';
import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';
import { FacebookAccount } from '@/domain/models';

export class FacebookAuthenticationService {
  constructor(
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepository:
      LoadUserAccountRepository & SaveFacebookAccountRepository,
    private readonly crypto: TokenGenerator,
  ) {}

  async perform({ token } : FacebookAuthentication.Params): Promise<any> {
    const fbData = await this.facebookApi.loadUser({ token });

    if (!fbData) {
      return new AuthenticationError();
    }

    const userAccountData = await this.userAccountRepository.load({ email: fbData.email });

    const fbAccount = new FacebookAccount(fbData, userAccountData);

    const { id } = await this.userAccountRepository.saveWithFacebook(fbAccount);

    await this.crypto.generateToken({ id });

    return fbData;
  }
}
