import { mock, MockProxy } from 'jest-mock-extended';

interface Validator {
  validate: () => Error | undefined;
}

class ValidationComposite implements Validator {
  constructor(
    private readonly validators: Validator[],
  ) {}

  validate(): Error | undefined {
    for (const validator of this.validators) {
      const error = validator.validate();

      if (error) {
        return error;
      }
    }

    return undefined;
  }
}

describe('ValidationComposite', () => {
  let validator1: MockProxy<Validator>;
  let validator2: MockProxy<Validator>;

  let validators: Validator[];

  let sut: ValidationComposite;

  beforeEach(() => {
    validator1 = mock<Validator>();
    validator2 = mock<Validator>();

    validators = [validator1, validator2];
  });

  beforeEach(() => {
    sut = new ValidationComposite(validators);
  });

  it('should return undefined if all validators returns undefined', () => {
    const result = sut.validate();

    expect(result).toBeUndefined();
  });

  it('should return the first error', () => {
    const error = new Error('first_error');

    validator1.validate.mockReturnValueOnce(error);
    validator2.validate.mockReturnValueOnce(new Error('second_error'));

    const result = sut.validate();

    expect(result).toEqual(error);
  });
});
