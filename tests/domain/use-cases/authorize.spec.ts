import { mock, MockProxy } from 'jest-mock-extended';

interface TokenValidator {
  validate: (params: TokenValidator.Params) => Promise<TokenValidator.Result>;
}

namespace TokenValidator {
  export type Params = {
    token: string;
  }

  export type Result = string;
}

type Input = {
  token: string;
}

type Output = string;

type Authorize = (params: Input) => Promise<Output>;

type Setup = (crypto: TokenValidator) => Authorize;

const setupAuthorize: Setup = (crypto) => async (params) => crypto.validate(params);

describe('Authorize', () => {
  let crypto: MockProxy<TokenValidator>;
  let token: string;
  let userId: string;

  let sut: Authorize;

  beforeAll(() => {
    token = 'any_token';
    userId = 'any_user_id';

    crypto = mock();

    crypto.validate.mockResolvedValue(userId);
  });

  beforeEach(() => {
    sut = setupAuthorize(crypto);
  });

  it('should call TokenValidator with correct params', async () => {
    await sut({ token });

    expect(crypto.validate).toHaveBeenCalledWith({ token });
    expect(crypto.validate).toHaveBeenCalledTimes(1);
  });

  it('should return user id on success', async () => {
    const result = await sut({ token });

    expect(result).toEqual(userId);
  });
});
