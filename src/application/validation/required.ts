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

export class RequiredBuffer extends Required {
  constructor(
    override readonly value: Buffer,
    override readonly fieldName?: string,
  ) {
    super(value, fieldName);
  }

  override validate(): Error | undefined {
    if (super.validate() !== undefined || this.value.length === 0) {
      return new RequiredFieldError(this.fieldName);
    }

    return undefined;
  }
}
