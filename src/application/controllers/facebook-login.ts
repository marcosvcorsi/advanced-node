import { RequiredFieldError } from '@/application/errors';
import {
  badRequest, HttpResponse, ok, serverError, unauthorized,
} from '@/application/helpers';
import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';

type HttpRequest = {
  token: string | undefined | null;
}

type Result = Error | {
  accessToken: string
}

export class FacebookLoginController {
  constructor(
    private readonly facebookAuthentication: FacebookAuthentication,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse<Result>> {
    try {
      const { token } = httpRequest;

      if (!token) {
        return badRequest(new RequiredFieldError('token'));
      }

      const result = await this.facebookAuthentication.perform({ token });

      if (result instanceof AuthenticationError) {
        return unauthorized();
      }

      return ok({
        accessToken: result.value,
      });
    } catch (error) {
      return serverError(error);
    }
  }
}
