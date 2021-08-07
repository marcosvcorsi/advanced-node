import {
  badRequest, HttpResponse, ok, serverError, unauthorized,
} from '@/application/helpers';
import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';

import { RequiredStringValidator, ValidationComposite } from '../validation';

type HttpRequest = {
  token: string;
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
      const error = this.validate(httpRequest);

      if (error) {
        return badRequest(error);
      }

      const { token } = httpRequest;

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

  private validate({ token }: HttpRequest): Error | undefined {
    const validators = [
      new RequiredStringValidator(token, 'token'),
    ];

    const validator = new ValidationComposite(validators);

    return validator.validate();
  }
}
