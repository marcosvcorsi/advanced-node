import { Controller } from '@/application/controllers';
import {
  HttpResponse, ok, unauthorized,
} from '@/application/helpers';
import { ValidationBuilder, Validator } from '@/application/validation';
import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/use-cases';

type HttpRequest = {
  token: string;
}

type Result = Error | {
  accessToken: string
}

export class FacebookLoginController extends Controller<HttpRequest> {
  constructor(
    private readonly facebookAuthentication: FacebookAuthentication,
  ) {
    super();
  }

  async perform(httpRequest: HttpRequest): Promise<HttpResponse<Result>> {
    const { token } = httpRequest;

    const result = await this.facebookAuthentication({ token });

    if (result instanceof AuthenticationError) {
      return unauthorized();
    }

    return ok({
      accessToken: result.value,
    });
  }

  buildValidators({ token }: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder
        .of({
          value: token,
          fieldName: 'token',
        })
        .required()
        .build(),
    ];
  }
}
