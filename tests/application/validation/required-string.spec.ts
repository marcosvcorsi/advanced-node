import { RequiredFieldError } from '@/application/errors';
import { RequiredStringValidator } from '@/application/validation';

describe('RequiredStringValidator', () => {
  let fieldName: string;

  beforeAll(() => {
    fieldName = 'any_field';
  });

  it('should return an RequiredFieldError if value is empty', () => {
    const sut = new RequiredStringValidator('', fieldName);

    const result = sut.validate();

    expect(result).toEqual(new RequiredFieldError(fieldName));
  });

  it('should return an RequiredFieldError if value is null', () => {
    const sut = new RequiredStringValidator(null as any, fieldName);

    const result = sut.validate();

    expect(result).toEqual(new RequiredFieldError(fieldName));
  });

  it('should return an RequiredFieldError if value is undefined', () => {
    const sut = new RequiredStringValidator(undefined as any, fieldName);

    const result = sut.validate();

    expect(result).toEqual(new RequiredFieldError(fieldName));
  });

  it('should return undefined if value is truthy', () => {
    const sut = new RequiredStringValidator('any_value', fieldName);

    const result = sut.validate();

    expect(result).toBeUndefined();
  });
});
