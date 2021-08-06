import { RequiredFieldError } from '@/application/errors';

class RequiredStringValidator {
  constructor(
    private readonly value: string,
    private readonly fieldName: string,
  ) {}

  validate(): Error | undefined {
    return new RequiredFieldError(this.fieldName);
  }
}

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
});
