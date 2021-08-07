import { mock, MockProxy } from 'jest-mock-extended';

import { FacebookLoginController } from '@/application/controllers';
import { UnauthorizedError } from '@/application/errors';
import { RequiredStringValidator } from '@/application/validation';
import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';
import { AccessToken } from '@/domain/models';

jest.mock('@/application/validation/composite');

describe('FacebookLoginController', () => {
  let token: string;

  let facebookAuthentication: MockProxy<FacebookAuthentication>;

  let sut: FacebookLoginController;

  beforeAll(() => {
    token = 'any_token';

    facebookAuthentication = mock();

    facebookAuthentication.perform.mockResolvedValue(new AccessToken('any_value'));
  });

  beforeEach(() => {
    sut = new FacebookLoginController(
      facebookAuthentication,
    );
  });

  it('should build Validators correctly', async () => {
    const validators = sut.buildValidators({ token: '' });

    expect(validators).toEqual([
      new RequiredStringValidator('', 'token'),
    ]);
  });

  it('should call FacebookAuthentication with correct params', async () => {
    await sut.handle({ token });

    expect(facebookAuthentication.perform).toHaveBeenCalledWith({
      token,
    });
    expect(facebookAuthentication.perform).toHaveBeenCalledTimes(1);
  });

  it('should return 401 if Authentication fails', async () => {
    facebookAuthentication.perform.mockResolvedValueOnce(new AuthenticationError());

    const httpResponse = await sut.handle({ token });

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new UnauthorizedError(),
    });
  });

  it('should return 200 if Authentication succeeds', async () => {
    const httpResponse = await sut.handle({ token });

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        accessToken: 'any_value',
      },
    });
  });
});
