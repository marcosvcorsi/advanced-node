import { HttpResponse, ok, unauthorized } from '@/application/helpers';
import { RequiredStringValidator } from '@/application/validation';
import { Authorize } from '@/domain/use-cases';

type HttpRequest = {
  authorization: string
}

type Result = Error | { userId: string }

export class AuthenticationMiddleware {
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
