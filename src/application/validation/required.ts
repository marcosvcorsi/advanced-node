import { RequiredFieldError } from '@/application/errors';

export class Required {
  constructor(
    readonly value: unknown,
    readonly fieldName?: string,
  ) { }

  validate(): Error | undefined {
    if (this.value === undefined || this.value === null) {
      return new RequiredFieldError(this.fieldName);
    }

    return undefined;
  }
}
