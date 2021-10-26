import { RequiredFieldError } from '@/application/errors';

import { Required } from './required';

export class RequiredString extends Required {
  constructor(
    override readonly value: string,
    override readonly fieldName?: string,
  ) {
    super(value, fieldName);
  }

  override validate(): Error | undefined {
    if (super.validate() !== undefined || this.value === '') {
      return new RequiredFieldError(this.fieldName);
    }

    return undefined;
  }
}
