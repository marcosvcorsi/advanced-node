import { mock, MockProxy } from 'jest-mock-extended';

interface TokenValidator {
  validate: (params: TokenValidator.Params) => Promise<TokenValidator.Result>;
}

namespace TokenValidator {
  export type Params = {
    token: string;
  }

  export type Result = boolean;
}

type Input = {
  token: string;
}

type Authorize = (params: Input) => Promise<void>;

type Setup = (crypto: TokenValidator) => Authorize;

const setupAuthorize: Setup = (crypto) => async (params) => {
  await crypto.validate(params);
};

describe('Authorize', () => {
  let crypto: MockProxy<TokenValidator>;
  let token: string;

  let sut: Authorize;

  beforeAll(() => {
    token = 'any_token';

    crypto = mock();
  });

  beforeEach(() => {
    sut = setupAuthorize(crypto);
  });

  it('should call TokenValidator with correct params', async () => {
    await sut({ token });

    expect(crypto.validate).toHaveBeenCalledWith({ token });
    expect(crypto.validate).toHaveBeenCalledTimes(1);
  });
});
