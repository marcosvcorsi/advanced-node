import { mock, MockProxy } from 'jest-mock-extended';
import { mocked } from 'ts-jest/utils';

import { FacebookLoginController } from '@/application/controllers';
import { ServerError, UnauthorizedError } from '@/application/errors';
import { RequiredStringValidator } from '@/application/validation';
import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';
import { AccessToken } from '@/domain/models';

jest.mock('@/application/validation/required-string');

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

  it('should return 400 if validator fails', async () => {
    const error = new Error('any_error');

    const RequiredStringValidatorSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValueOnce(error),
    }));

    mocked(RequiredStringValidator).mockImplementationOnce(RequiredStringValidatorSpy);

    const httpResponse = await sut.handle({ token: '' });

    expect(RequiredStringValidator).toHaveBeenCalledWith('', 'token');
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: error,
    });
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

  it('should return 500 if Authentication throws', async () => {
    const error = new Error('any_error');

    facebookAuthentication.perform.mockRejectedValue(new Error('any_error'));

    const httpResponse = await sut.handle({ token });

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError(error),
    });
  });
});
