import { Validator, RequiredString } from '@/application/validation';

type ValidationBuilderParams = {
  value: string,
  fieldName: string;
}

export class ValidationBuilder {
  private constructor(
    private readonly value: string,
    private readonly fieldName: string,
    private readonly validators: Validator[] = [],
  ) {}

  static of({ value, fieldName }: ValidationBuilderParams): ValidationBuilder {
    return new ValidationBuilder(value, fieldName);
  }

  required(): ValidationBuilder {
    this.validators.push(new RequiredString(this.value, this.fieldName));

    return this;
  }

  build(): Validator[] {
    return this.validators;
  }
}
