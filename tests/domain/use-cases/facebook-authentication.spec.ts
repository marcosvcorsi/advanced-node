import { mock, MockProxy } from 'jest-mock-extended';
import { mocked } from 'ts-jest/utils';

import { LoadFacebookUser, TokenGenerator } from '@/domain/contracts/gateways';
import { SaveFacebookAccountRepository, LoadUserAccountRepository } from '@/domain/contracts/repositories';
import { AccessToken, FacebookAccount } from '@/domain/entities';
import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication, setupFacebookAuthentication } from '@/domain/use-cases';

jest.mock('@/domain/entities/facebook-account');

describe('FacebookAuthentication', () => {
  let facebookApi: MockProxy<LoadFacebookUser>;
  let userAccountRepository: MockProxy<
    LoadUserAccountRepository &
    SaveFacebookAccountRepository
  >;
  let crypto: MockProxy<TokenGenerator>;
  let token: string;

  let sut: FacebookAuthentication;

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

    crypto.generate.mockResolvedValue('any_generated_token');
  });

  beforeEach(() => {
    sut = setupFacebookAuthentication(
      facebookApi,
      userAccountRepository,
      crypto,
    );
  });

  it('should call LoadFacebookUser with correct params', async () => {
    await sut({ token });

    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token });
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it('should throw Authentication error when LoadFacebookUser returns falsy', async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined);

    await expect(sut({ token })).rejects.toThrow(AuthenticationError);
  });

  it('should call LoadUserByEmailRepository when LoadFacebookUser returns data', async () => {
    await sut({ token });

    expect(userAccountRepository.load).toHaveBeenCalledWith({ email: 'any_mail' });
    expect(userAccountRepository.load).toHaveBeenCalledTimes(1);
  });

  it('should call SaveFacebookAccountRepository with FacebookAccount', async () => {
    const FacebokAccountStub = jest.fn().mockImplementation(() => ({
      name: 'any_name',
    }));

    mocked(FacebookAccount).mockImplementation(FacebokAccountStub);

    await sut({ token });

    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledWith({
      name: 'any_name',
    });
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1);
  });

  it('should call TokenGenerator with correct params', async () => {
    await sut({ token });

    expect(crypto.generate).toHaveBeenCalledWith({
      key: 'any_id',
      expirationInMs: AccessToken.expirationInMs,
    });
    expect(crypto.generate).toHaveBeenCalledTimes(1);
  });

  it('should return an access token on success', async () => {
    const result = await sut({ token });

    expect(result).toEqual({ accessToken: 'any_generated_token' });
  });

  it('should throw if LoadFacebookApi throws', async () => {
    facebookApi.loadUser.mockRejectedValueOnce(new Error('fb_error'));

    await expect(sut({ token })).rejects.toThrow(new Error('fb_error'));
  });

  it('should throw if LoadUserAccountRepository throws', async () => {
    userAccountRepository.load.mockRejectedValueOnce(new Error('load_error'));

    await expect(sut({ token })).rejects.toThrow(new Error('load_error'));
  });

  it('should throw if SaveFacebookAccountRepository throws', async () => {
    userAccountRepository.saveWithFacebook.mockRejectedValueOnce(new Error('save_error'));

    await expect(sut({ token })).rejects.toThrow(new Error('save_error'));
  });

  it('should throw if TokenGenerator throws', async () => {
    crypto.generate.mockRejectedValueOnce(new Error('generation_error'));

    await expect(sut({ token })).rejects.toThrow(new Error('generation_error'));
  });
});
