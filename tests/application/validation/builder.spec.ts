import { RequiredStringValidator } from '@/application/validation';
import { ValidationBuilder } from '@/application/validation/builder';

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
