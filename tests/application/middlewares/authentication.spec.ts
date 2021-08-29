import { UnauthorizedError } from '@/application/errors';
import { HttpResponse, unauthorized } from '@/application/helpers';

type HttpRequest = {
  authorization: string
}

class AuthenticationMiddleware {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    console.log(httpRequest);

    return unauthorized();
  }
}

describe('AuthenticationMiddleware', () => {
  let sut: AuthenticationMiddleware;

  beforeEach(() => {
    sut = new AuthenticationMiddleware();
  });

  it('should return 401 if authorization is empty', async () => {
    const response = await sut.handle({ authorization: '' });

    expect(response).toEqual({
      statusCode: 401,
      data: new UnauthorizedError(),
    });
  });

  it('should return 401 if authorization is null', async () => {
    const response = await sut.handle({ authorization: null as any });

    expect(response).toEqual({
      statusCode: 401,
      data: new UnauthorizedError(),
    });
  });

  it('should return 401 if authorization is undefined', async () => {
    const response = await sut.handle({ authorization: undefined as any });

    expect(response).toEqual({
      statusCode: 401,
      data: new UnauthorizedError(),
    });
  });
});
