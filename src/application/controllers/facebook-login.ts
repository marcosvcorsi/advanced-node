import { RequiredFieldError } from '@/application/errors';
import {
  badRequest, HttpResponse, serverError, unauthorized,
} from '@/application/helpers';
import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';

export class FacebookLoginController {
  constructor(
    private readonly facebookAuthentication: FacebookAuthentication,
  ) {}

  async handle(httpRequest: any): Promise<HttpResponse> {
    try {
      const { token } = httpRequest;

      if (!token) {
        return badRequest(new RequiredFieldError('token'));
      }

      const result = await this.facebookAuthentication.perform({ token });

      if (result instanceof AuthenticationError) {
        return unauthorized();
      }

      return {
        statusCode: 200,
        data: {
          accessToken: result.value,
        },
      };
    } catch (error) {
      return serverError(error);
    }
  }
}
