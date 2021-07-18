import { LoadFacebookUserApi } from '@/data/contracts/apis';
import { FacebookAuthenticationService } from '@/data/services';
import { AuthenticationError } from '@/domain/errors';

class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  token?: string;
  result?: any;

  async loadUser({ token }: LoadFacebookUserApi.Params): Promise<void> {
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
