import { mock, MockProxy } from 'jest-mock-extended';

import { LoadFacebookUserApi } from '@/data/contracts/apis';
import { FacebookAuthenticationService } from '@/data/services';
import { AuthenticationError } from '@/domain/errors';

describe('FacebookAuthenticationService', () => {
  let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>;
  let sut: FacebookAuthenticationService;

  beforeEach(() => {
    loadFacebookUserApi = mock<LoadFacebookUserApi>();
    sut = new FacebookAuthenticationService(loadFacebookUserApi);
  });

  it('should call LoadFacebookUserApi with correct params', async () => {
    const token = 'any_token';

    await sut.perform({ token });

    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token });
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it('should return Authentication error when LoadFacebookUserApi returns falsy', async () => {
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined);

    const token = 'any_token';

    const authResult = await sut.perform({ token });

    expect(authResult).toEqual(new AuthenticationError());
  });
});
