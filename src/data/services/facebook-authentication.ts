import { LoadFacebookUserApi } from '@/data/contracts/apis';
import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';

export class FacebookAuthenticationService {
  constructor(
    private readonly loadFacebookUserByTokenApi: LoadFacebookUserApi,
  ) {}

  async perform({ token } : FacebookAuthentication.Params): Promise<any> {
    const user = await this.loadFacebookUserByTokenApi.loadUser({ token });

    if (!user) {
      return new AuthenticationError();
    }

    return user;
  }
}
