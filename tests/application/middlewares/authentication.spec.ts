import { UnauthorizedError } from '@/application/errors';
import { HttpResponse, ok, unauthorized } from '@/application/helpers';
import { RequiredStringValidator } from '@/application/validation';
import { Authorize } from '@/domain/use-cases';

type HttpRequest = {
  authorization: string
}

class AuthenticationMiddleware {
  constructor(
    private readonly authorize: Authorize,
  ) {}

  async handle({ authorization }: HttpRequest): Promise<HttpResponse | undefined> {
    const error = new RequiredStringValidator(authorization, 'authorization').validate();

    if (error) {
      return unauthorized();
    }

    try {
      const userId = await this.authorize({ token: authorization });

      return ok({ userId });
    } catch {
      return unauthorized();
    }
  }
}

describe('AuthenticationMiddleware', () => {
  let authorization: string;
  let userId: string;
  let authorize: jest.Mock;

  let sut: AuthenticationMiddleware;

  beforeAll(() => {
    authorization = 'any_token';
    userId = 'any_user_id';

    authorize = jest.fn().mockResolvedValue(userId);
  });

  beforeEach(() => {
    sut = new AuthenticationMiddleware(
      authorize,
    );
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

  it('should call Authorized with correct params', async () => {
    await sut.handle({ authorization });

    expect(authorize).toHaveBeenCalledWith({ token: authorization });
    expect(authorize).toHaveBeenCalledTimes(1);
  });

  it('should return 401 if Authorize throws', async () => {
    authorize.mockRejectedValueOnce(new Error());

    const response = await sut.handle({ authorization });

    expect(response).toEqual({
      statusCode: 401,
      data: new UnauthorizedError(),
    });
  });

  it('should return 200 with userId on success', async () => {
    const response = await sut.handle({ authorization });

    expect(response).toEqual({
      statusCode: 200,
      data: {
        userId,
      },
    });
  });
});
