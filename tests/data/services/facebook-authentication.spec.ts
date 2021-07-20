import { mock, MockProxy } from 'jest-mock-extended';

import { LoadFacebookUserApi } from '@/data/contracts/apis';
import { CreateFacebookAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repositories';
import { FacebookAuthenticationService } from '@/data/services';
import { AuthenticationError } from '@/domain/errors';

describe('FacebookAuthenticationService', () => {
  let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>;
  let loadUserAccountRepository: MockProxy<LoadUserAccountRepository>;
  let createFacebookAccountRepository: MockProxy<CreateFacebookAccountRepository>;
  let sut: FacebookAuthenticationService;

  const token = 'any_token';

  beforeEach(() => {
    loadFacebookUserApi = mock<LoadFacebookUserApi>();
    loadUserAccountRepository = mock<LoadUserAccountRepository>();
    createFacebookAccountRepository = mock<CreateFacebookAccountRepository>();

    sut = new FacebookAuthenticationService(
      loadFacebookUserApi,
      loadUserAccountRepository,
      createFacebookAccountRepository,
    );

    loadFacebookUserApi.loadUser.mockResolvedValue({
      name: 'any_name',
      email: 'any_mail',
      facebookId: 'any_fb_id',
    });
  });

  it('should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token });

    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token });
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it('should return Authentication error when LoadFacebookUserApi returns falsy', async () => {
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined);

    const authResult = await sut.perform({ token });

    expect(authResult).toEqual(new AuthenticationError());
  });

  it('should call LoadUserByEmailRepository when LoadFacebookUserApi returns data', async () => {
    await sut.perform({ token });

    expect(loadUserAccountRepository.load).toHaveBeenCalledWith({ email: 'any_mail' });
    expect(loadUserAccountRepository.load).toHaveBeenCalledTimes(1);
  });

  it('should call CreateFacebookAccountRepository when LoadUserByEmailRepository returns undefined', async () => {
    loadUserAccountRepository.load.mockResolvedValueOnce(undefined);

    await sut.perform({ token });

    expect(createFacebookAccountRepository.createFromFacebook).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_mail',
      facebookId: 'any_fb_id',
    });
    expect(createFacebookAccountRepository.createFromFacebook).toHaveBeenCalledTimes(1);
  });
});
