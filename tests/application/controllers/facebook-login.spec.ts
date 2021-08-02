import { mock, MockProxy } from 'jest-mock-extended';

import { FacebookAuthentication } from '@/domain/features';

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

    await this.facebookAuthentication.perform({ token });

    return {
      statusCode: 400,
      data: new Error('The field token is required'),
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
});
