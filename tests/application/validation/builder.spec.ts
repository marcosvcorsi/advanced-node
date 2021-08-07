import { RequiredStringValidator, Validator } from '@/application/validation';

type ValidationBuilderParams = {
  value: string,
  fieldName: string;
}

class ValidationBuilder {
  private constructor(
    private readonly value: string,
    private readonly fieldName: string,
    private readonly validators: Validator[] = [],
  ) {}

  static of({ value, fieldName }: ValidationBuilderParams): ValidationBuilder {
    return new ValidationBuilder(value, fieldName);
  }

  required(): ValidationBuilder {
    this.validators.push(new RequiredStringValidator(this.value, this.fieldName));

    return this;
  }

  build(): Validator[] {
    return this.validators;
  }
}

describe('ValidationBuilder', () => {
  it('should return a RequiredStringValidator', () => {
    const value = 'any_value';
    const fieldName = 'any_name';

    const validators = ValidationBuilder.of({
      value,
      fieldName,
    }).required().build();

    expect(validators).toEqual([new RequiredStringValidator(value, fieldName)]);
  });
});
