import { RequiredFieldError } from '@/application/errors';
import { Required } from '@/application/validation';

describe('Required', () => {
  let fieldName: string;

  beforeAll(() => {
    fieldName = 'any_field';
  });

  it('should return an RequiredFieldError if value is null', () => {
    const sut = new Required(null as any, fieldName);

    const result = sut.validate();

    expect(result).toEqual(new RequiredFieldError(fieldName));
  });

  it('should return an RequiredFieldError if value is undefined', () => {
    const sut = new Required(undefined as any, fieldName);

    const result = sut.validate();

    expect(result).toEqual(new RequiredFieldError(fieldName));
  });

  it('should return undefined if value is truthy', () => {
    const sut = new Required('any_value', fieldName);

    const result = sut.validate();

    expect(result).toBeUndefined();
  });
});
