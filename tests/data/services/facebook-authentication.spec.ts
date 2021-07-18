import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';

class FacebookAuthenticationService {
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

interface LoadFacebookUserApi {
  loadUser: (params: LoadFacebookUserByTokenApi.Params)
    => Promise<LoadFacebookUserByTokenApi.Result>;
}

namespace LoadFacebookUserByTokenApi {
  export type Params = {
    token: string;
  }

  export type Result = any;
}

class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  token?: string;
  result?: any;

  async loadUser({ token }: LoadFacebookUserByTokenApi.Params): Promise<void> {
    this.token = token;

    return this.result;
  }
}

describe('FacebookAuthenticationService', () => {
  it('should call LoadFacebookUserApi with correct params', async () => {
    const loadFacebookUserApi = new LoadFacebookUserApiSpy();

    const sut = new FacebookAuthenticationService(loadFacebookUserApi);

    const token = 'any_token';

    await sut.perform({ token });

    expect(loadFacebookUserApi.token).toBe(token);
  });

  it('should return Authentication error when LoadFacebookUserApi returns falsy', async () => {
    const loadFacebookUserApi = new LoadFacebookUserApiSpy();

    loadFacebookUserApi.result = undefined;

    const sut = new FacebookAuthenticationService(loadFacebookUserApi);

    const token = 'any_token';

    const authResult = await sut.perform({ token });

    expect(authResult).toEqual(new AuthenticationError());
  });
});
