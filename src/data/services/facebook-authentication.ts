import { LoadFacebookUserApi } from '@/data/contracts/apis';
import { CreateFacebookAccountRepository, LoadUserAccountRepository, UpdateFacebookAccountRepository } from '@/data/contracts/repositories';
import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';

export class FacebookAuthenticationService {
  constructor(
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepository:
      LoadUserAccountRepository & CreateFacebookAccountRepository & UpdateFacebookAccountRepository,
  ) {}

  async perform({ token } : FacebookAuthentication.Params): Promise<any> {
    const fbData = await this.facebookApi.loadUser({ token });

    if (!fbData) {
      return new AuthenticationError();
    }

    const { email, name, facebookId } = fbData;

    const userAccountData = await this.userAccountRepository.load({ email });

    if (userAccountData) {
      await this.userAccountRepository.updateWithFacebook({
        id: userAccountData.id,
        name: userAccountData.name || fbData.name,
        facebookId,
      });
    } else {
      await this.userAccountRepository.createFromFacebook({
        email,
        name,
        facebookId,
      });
    }

    return fbData;
  }
}
