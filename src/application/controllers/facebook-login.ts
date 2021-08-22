import { Controller } from '@/application/controllers';
import {
  HttpResponse, ok, unauthorized,
} from '@/application/helpers';
import { ValidationBuilder, Validator } from '@/application/validation';
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
    try {
      const { token } = httpRequest;

      const accessToken = await this.facebookAuthentication({ token });

      return ok(accessToken);
    } catch {
      return unauthorized();
    }
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
