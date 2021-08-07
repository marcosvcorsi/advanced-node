import { RequiredStringValidator, ValidationBuilder } from '@/application/validation';

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
