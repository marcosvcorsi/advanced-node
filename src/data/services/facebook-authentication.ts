import { LoadFacebookUserApi } from '@/data/contracts/apis';
import { SaveFacebookAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repositories';
import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';

export class FacebookAuthenticationService {
  constructor(
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepository:
      LoadUserAccountRepository & SaveFacebookAccountRepository,
  ) {}

  async perform({ token } : FacebookAuthentication.Params): Promise<any> {
    const fbData = await this.facebookApi.loadUser({ token });

    if (!fbData) {
      return new AuthenticationError();
    }

    const { email, name, facebookId } = fbData;

    const userAccountData = await this.userAccountRepository.load({ email });

    await this.userAccountRepository.saveWithFacebook({
      id: userAccountData?.id,
      name: userAccountData?.name ?? name,
      email: fbData.email,
      facebookId,
    });

    return fbData;
  }
}
