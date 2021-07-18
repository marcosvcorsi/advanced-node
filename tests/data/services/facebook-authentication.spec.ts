import { mock } from 'jest-mock-extended';

import { LoadFacebookUserApi } from '@/data/contracts/apis';
import { FacebookAuthenticationService } from '@/data/services';
import { AuthenticationError } from '@/domain/errors';

describe('FacebookAuthenticationService', () => {
  it('should call LoadFacebookUserApi with correct params', async () => {
    const loadFacebookUserApi = mock<LoadFacebookUserApi>();

    const sut = new FacebookAuthenticationService(loadFacebookUserApi);

    const token = 'any_token';

    await sut.perform({ token });

    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token });
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it('should return Authentication error when LoadFacebookUserApi returns falsy', async () => {
    const loadFacebookUserApi = mock<LoadFacebookUserApi>();

    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined);

    const sut = new FacebookAuthenticationService(loadFacebookUserApi);

    const token = 'any_token';

    const authResult = await sut.perform({ token });

    expect(authResult).toEqual(new AuthenticationError());
  });
});
