import { LoadFacebookUserApi } from '@/data/contracts/apis';
import { CreateFacebookAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repositories';
import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';

export class FacebookAuthenticationService {
  constructor(
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepository:
      LoadUserAccountRepository & CreateFacebookAccountRepository,
  ) {}

  async perform({ token } : FacebookAuthentication.Params): Promise<any> {
    const fbData = await this.facebookApi.loadUser({ token });

    if (!fbData) {
      return new AuthenticationError();
    }

    const { email, name, facebookId } = fbData;

    await this.userAccountRepository.load({ email });

    await this.userAccountRepository.createFromFacebook({
      email,
      name,
      facebookId,
    });

    return fbData;
  }
}
