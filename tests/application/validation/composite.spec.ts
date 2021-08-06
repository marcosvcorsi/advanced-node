import { mock } from 'jest-mock-extended';

interface Validator {
  validate: () => Error | undefined;
}

class ValidationComposite {
  constructor(
    private readonly validators: Validator[],
  ) {}

  validate(): undefined {
    return undefined;
  }
}

describe('ValidationComposite', () => {
  it('should return undefined if all validators returns undefined', () => {
    const validator1 = mock<Validator>();
    const validator2 = mock<Validator>();

    const validator: Validator[] = [
      validator1,
      validator2,
    ];

    const sut = new ValidationComposite(validator);

    const error = sut.validate();

    expect(error).toBeUndefined();
  });
});
