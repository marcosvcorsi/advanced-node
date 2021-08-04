import { ServerError } from '@/application/errors';
import { HttpResponse } from '@/application/helpers';
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
