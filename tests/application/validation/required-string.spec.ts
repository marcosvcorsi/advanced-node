import { RequiredFieldError } from '@/application/errors';
import { Required, RequiredString } from '@/application/validation';

describe('RequiredString', () => {
  let fieldName: string;

  beforeAll(() => {
    fieldName = 'any_field';
  });

  it('should extend Required', () => {
    const sut = new RequiredString('', fieldName);

    expect(sut).toBeInstanceOf(Required);
  });

  it('should return an RequiredFieldError if value is empty', () => {
    const sut = new RequiredString('', fieldName);

    const result = sut.validate();

    expect(result).toEqual(new RequiredFieldError(fieldName));
  });

  it('should return undefined if value is truthy', () => {
    const sut = new RequiredString('any_value', fieldName);

    const result = sut.validate();

    expect(result).toBeUndefined();
  });
});
