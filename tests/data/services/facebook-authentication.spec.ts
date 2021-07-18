import { FacebookAuthentication } from '@/domain/features';

class FacebookAuthenticationService {
  constructor(
    private readonly loadFacebookUserByTokenApi: LoadFacebookUserApi,
  ) {}

  async perform({ token } : FacebookAuthentication.Params): Promise<void> {
    await this.loadFacebookUserByTokenApi.loadUser({ token });
  }
}

interface LoadFacebookUserApi {
  loadUser: (params: LoadFacebookUserByTokenApi.Params) => Promise<void>;
}

namespace LoadFacebookUserByTokenApi {
  export type Params = {
    token: string;
  }
}

class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  token?: string;

  async loadUser({ token }: LoadFacebookUserByTokenApi.Params): Promise<void> {
    this.token = token;
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
});
