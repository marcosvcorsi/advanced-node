import { LoadFacebookUserApi } from '@/data/contracts/apis';
import { LoadUserAccountRepository } from '@/data/contracts/repositories';
import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';

export class FacebookAuthenticationService {
  constructor(
    private readonly loadFacebookUserByTokenApi: LoadFacebookUserApi,
    private readonly loadUserAccountRepository: LoadUserAccountRepository,
  ) {}

  async perform({ token } : FacebookAuthentication.Params): Promise<any> {
    const fbData = await this.loadFacebookUserByTokenApi.loadUser({ token });

    if (!fbData) {
      return new AuthenticationError();
    }

    await this.loadUserAccountRepository.load({ email: fbData.email });

    return fbData;
  }
}
