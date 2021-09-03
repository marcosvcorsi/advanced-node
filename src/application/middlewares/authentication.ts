import { HttpResponse, ok, unauthorized } from '@/application/helpers';
import { Middleware } from '@/application/middlewares';
import { RequiredStringValidator } from '@/application/validation';

type HttpRequest = {
  authorization: string
}

type Result = Error | { userId: string }

export type Authorize = (params: { token: string }) => Promise<string>;

export class AuthenticationMiddleware implements Middleware {
  constructor(
    private readonly authorize: Authorize,
  ) {}

  async handle({ authorization }: HttpRequest): Promise<HttpResponse<Result>> {
    if (this.validate(authorization)) {
      return unauthorized();
    }

    try {
      const userId = await this.authorize({ token: authorization });

      return ok({ userId });
    } catch {
      return unauthorized();
    }
  }

  private validate(authorization: string): boolean {
    const error = new RequiredStringValidator(authorization, 'authorization').validate();

    return !!error;
  }
}
