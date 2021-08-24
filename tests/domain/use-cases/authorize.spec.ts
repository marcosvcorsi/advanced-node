import { mock, MockProxy } from 'jest-mock-extended';

import { TokenValidator } from '@/domain/contracts/crypto';
import { Authorize, setupAuthorize } from '@/domain/use-cases';

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
