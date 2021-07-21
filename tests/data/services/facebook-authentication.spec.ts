import { mock, MockProxy } from 'jest-mock-extended';

import { LoadFacebookUserApi } from '@/data/contracts/apis';
import { CreateFacebookAccountRepository, LoadUserAccountRepository, UpdateFacebookAccountRepository } from '@/data/contracts/repositories';
import { FacebookAuthenticationService } from '@/data/services';
import { AuthenticationError } from '@/domain/errors';

describe('FacebookAuthenticationService', () => {
  let facebookApi: MockProxy<LoadFacebookUserApi>;
  let userAccountRepository: MockProxy<
    LoadUserAccountRepository &
    CreateFacebookAccountRepository &
    UpdateFacebookAccountRepository
  >;
  let sut: FacebookAuthenticationService;

  const token = 'any_token';

  beforeEach(() => {
    facebookApi = mock<LoadFacebookUserApi>();
    userAccountRepository = mock();

    sut = new FacebookAuthenticationService(
      facebookApi,
      userAccountRepository,
    );

    facebookApi.loadUser.mockResolvedValue({
      name: 'any_name',
      email: 'any_mail',
      facebookId: 'any_fb_id',
    });
  });

  it('should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token });

    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token });
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it('should return Authentication error when LoadFacebookUserApi returns falsy', async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined);

    const authResult = await sut.perform({ token });

    expect(authResult).toEqual(new AuthenticationError());
  });

  it('should call LoadUserByEmailRepository when LoadFacebookUserApi returns data', async () => {
    await sut.perform({ token });

    expect(userAccountRepository.load).toHaveBeenCalledWith({ email: 'any_mail' });
    expect(userAccountRepository.load).toHaveBeenCalledTimes(1);
  });

  it('should call CreateFacebookAccountRepository when LoadUserByEmailRepository returns undefined', async () => {
    userAccountRepository.load.mockResolvedValueOnce(undefined);

    await sut.perform({ token });

    expect(userAccountRepository.createFromFacebook).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_mail',
      facebookId: 'any_fb_id',
    });
    expect(userAccountRepository.createFromFacebook).toHaveBeenCalledTimes(1);
  });

  it('should call UpdateFacebookAccountRepository when LoadUserByEmailRepository returns data', async () => {
    userAccountRepository.load.mockResolvedValueOnce({
      id: 'any_id',
      name: 'any_name',
    });

    await sut.perform({ token });

    expect(userAccountRepository.updateWithFacebook).toHaveBeenCalledWith({
      id: 'any_id',
      name: 'any_name',
      facebookId: 'any_fb_id',
    });
    expect(userAccountRepository.updateWithFacebook).toHaveBeenCalledTimes(1);
  });
});
