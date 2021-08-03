import { mock, MockProxy } from 'jest-mock-extended';

import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';
import { AccessToken } from '@/domain/models';

class ServerError extends Error {
  constructor(error?: Error) {
    super('Internal Server Error');

    this.name = 'ServerError';
    this.stack = error?.stack;
  }
}

type HttpResponse = {
  statusCode: number;
  data: any
}

class FacebookLoginController {
  constructor(
    private readonly facebookAuthentication: FacebookAuthentication,
  ) {}

  async handle(httpRequest: any): Promise<HttpResponse> {
    try {
      const { token } = httpRequest;

      if (!token) {
        return {
          statusCode: 400,
          data: new Error('The field token is required'),
        };
      }

      const result = await this.facebookAuthentication.perform({ token });

      if (result instanceof AuthenticationError) {
        return {
          statusCode: 401,
          data: result,
        };
      }

      return {
        statusCode: 200,
        data: {
          accessToken: result.value,
        },
      };
    } catch (error) {
      return {
        statusCode: 500,
        data: new ServerError(error),
      };
    }
  }
}

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

  it('should return 400 if token is empty', async () => {
    const httpResponse = await sut.handle({ token: '' });

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The field token is required'),
    });
  });

  it('should return 400 if token is null', async () => {
    const httpResponse = await sut.handle({ token: null });

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The field token is required'),
    });
  });

  it('should return 400 if token is undefined', async () => {
    const httpResponse = await sut.handle({ token: undefined });

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The field token is required'),
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
      data: new AuthenticationError(),
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
