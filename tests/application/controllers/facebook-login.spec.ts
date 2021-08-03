import { mock, MockProxy } from 'jest-mock-extended';

import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';
import { AccessToken } from '@/domain/models';

type HttpResponse = {
  statusCode: number;
  data: any
}

class FacebookLoginController {
  constructor(
    private readonly facebookAuthentication: FacebookAuthentication,
  ) {}

  async handle(httpRequest: any): Promise<HttpResponse> {
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

  it('should return 401 if authentication fails', async () => {
    facebookAuthentication.perform.mockResolvedValueOnce(new AuthenticationError());

    const httpResponse = await sut.handle({ token });

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new AuthenticationError(),
    });
  });

  it('should return 200 if authentication succeds', async () => {
    const httpResponse = await sut.handle({ token });

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        accessToken: 'any_value',
      },
    });
  });
});
