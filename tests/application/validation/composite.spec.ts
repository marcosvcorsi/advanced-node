import { mock, MockProxy } from 'jest-mock-extended';

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
    const error = sut.validate();

    expect(error).toBeUndefined();
  });
});
