import { mock, MockProxy } from 'jest-mock-extended';
import { mocked } from 'ts-jest/utils';

import { LoadFacebookUserApi } from '@/data/contracts/apis';
import { TokenGenerator } from '@/data/contracts/crypto';
import { SaveFacebookAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repositories';
import { FacebookAuthenticationService } from '@/data/services';
import { AuthenticationError } from '@/domain/errors';
import { AccessToken, FacebookAccount } from '@/domain/models';

jest.mock('@/domain/models/facebook-account');

describe('FacebookAuthenticationService', () => {
  let facebookApi: MockProxy<LoadFacebookUserApi>;
  let userAccountRepository: MockProxy<
    LoadUserAccountRepository &
    SaveFacebookAccountRepository
  >;
  let crypto: MockProxy<TokenGenerator>;
  let token: string;

  let sut: FacebookAuthenticationService;

  beforeAll(() => {
    token = 'any_token';

    facebookApi = mock();
    userAccountRepository = mock();
    crypto = mock();

    userAccountRepository.load.mockResolvedValue(undefined);
    userAccountRepository.saveWithFacebook.mockResolvedValue({ id: 'any_id' });

    facebookApi.loadUser.mockResolvedValue({
      name: 'any_name',
      email: 'any_mail',
      facebookId: 'any_fb_id',
    });

    crypto.generateToken.mockResolvedValue('any_generated_token');
  });

  beforeEach(() => {
    sut = new FacebookAuthenticationService(
      facebookApi,
      userAccountRepository,
      crypto,
    );
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

  it('should call TokenGenerator with correct params', async () => {
    await sut.perform({ token });

    expect(crypto.generateToken).toHaveBeenCalledWith({
      key: 'any_id',
      expirationInMs: AccessToken.expirationInMs,
    });
    expect(crypto.generateToken).toHaveBeenCalledTimes(1);
  });

  it('should return an access token on success', async () => {
    const result = await sut.perform({ token });

    expect(result).toEqual(new AccessToken('any_generated_token'));
  });

  it('should throw if LoadFacebookApi throws', async () => {
    facebookApi.loadUser.mockRejectedValueOnce(new Error('fb_error'));

    await expect(sut.perform({ token })).rejects.toThrow(new Error('fb_error'));
  });

  it('should throw if LoadUserAccountRepository throws', async () => {
    userAccountRepository.load.mockRejectedValueOnce(new Error('load_error'));

    await expect(sut.perform({ token })).rejects.toThrow(new Error('load_error'));
  });

  it('should throw if SaveFacebookAccountRepository throws', async () => {
    userAccountRepository.saveWithFacebook.mockRejectedValueOnce(new Error('save_error'));

    await expect(sut.perform({ token })).rejects.toThrow(new Error('save_error'));
  });

  it('should throw if TokenGenerator throws', async () => {
    crypto.generateToken.mockRejectedValueOnce(new Error('generation_error'));

    await expect(sut.perform({ token })).rejects.toThrow(new Error('generation_error'));
  });
});
