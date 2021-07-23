import { mock, MockProxy } from 'jest-mock-extended';
import { mocked } from 'ts-jest/utils';

import { LoadFacebookUserApi } from '@/data/contracts/apis';
import { SaveFacebookAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repositories';
import { FacebookAuthenticationService } from '@/data/services';
import { AuthenticationError } from '@/domain/errors';
import { FacebookAccount } from '@/domain/models';

jest.mock('@/domain/models/facebook-account');

describe('FacebookAuthenticationService', () => {
  let facebookApi: MockProxy<LoadFacebookUserApi>;
  let userAccountRepository: MockProxy<
    LoadUserAccountRepository &
    SaveFacebookAccountRepository
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

    userAccountRepository.load.mockResolvedValue(undefined);

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

  it('should call SaveFacebookAccountRepository with FacebookAccount', async () => {
    const FacebokAccountStub = jest.fn().mockImplementation(() => ({
      name: 'any_name',
    }));

    mocked(FacebookAccount).mockImplementation(FacebokAccountStub);

    await sut.perform({ token });

    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledWith({
      name: 'any_name',
    });
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1);
  });
});
