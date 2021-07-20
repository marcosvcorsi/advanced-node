import { LoadFacebookUserApi } from '@/data/contracts/apis';
import { CreateFacebookAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repositories';
import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';

export class FacebookAuthenticationService {
  constructor(
    private readonly loadFacebookUserByTokenApi: LoadFacebookUserApi,
    private readonly loadUserAccountRepository: LoadUserAccountRepository,
    private readonly createFacebookAccountRepository: CreateFacebookAccountRepository,
  ) {}

  async perform({ token } : FacebookAuthentication.Params): Promise<any> {
    const fbData = await this.loadFacebookUserByTokenApi.loadUser({ token });

    if (!fbData) {
      return new AuthenticationError();
    }

    const { email, name, facebookId } = fbData;

    await this.loadUserAccountRepository.load({ email });

    await this.createFacebookAccountRepository.createFromFacebook({
      email,
      name,
      facebookId,
    });

    return fbData;
  }
}
