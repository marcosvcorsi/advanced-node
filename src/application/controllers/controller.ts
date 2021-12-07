import { badRequest, HttpResponse, serverError } from '@/application/helpers';
import { ValidationComposite, Validator } from '@/application/validation';

export abstract class Controller<T = any> {
  async handle(httpRequest: T): Promise<HttpResponse> {
    const error = this.validate(httpRequest);

    if (error) {
      return badRequest(error);
    }

    try {
      const response = await this.perform(httpRequest);

      return response;
    } catch (error) {
      return serverError(error as Error);
    }
  }

  private validate(httpRequest: T): Error | undefined {
    const validator = new ValidationComposite(this.buildValidators(httpRequest));

    return validator.validate();
  }

  buildValidators(_httpRequest: T): Validator[] {
    return [];
  }

  abstract perform(httpRequest: T): Promise<HttpResponse>;
}
