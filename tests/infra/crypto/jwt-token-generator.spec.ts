import jwt from 'jsonwebtoken';

import { TokenGenerator } from '@/data/contracts/crypto';

class JwtTokenGenerator implements TokenGenerator {
  constructor(
    private readonly secret: string,
  ) {}

  async generateToken(params: TokenGenerator.Params): Promise<TokenGenerator.Result> {
    const { key, expirationInMs } = params;

    const expiresInSeconds = expirationInMs / 1000;

    jwt.sign({ key }, this.secret, { expiresIn: expiresInSeconds });

    return '';
  }
}

jest.mock('jsonwebtoken');

describe('JwtTokenGenerator', () => {
  let key: string;
  let expirationInMs: number;
  let secret: string;

  let fakeJwt: jest.Mocked<typeof jwt>;

  let sut: JwtTokenGenerator;

  beforeAll(() => {
    fakeJwt = jwt as jest.Mocked<typeof jwt>;

    key = 'any_key';
    expirationInMs = 1000;
    secret = 'any_secret';
  });

  beforeEach(() => {
    sut = new JwtTokenGenerator(secret);
  });

  it('should call jsonwebtoken sign with correct params', async () => {
    await sut.generateToken({ key, expirationInMs });

    expect(fakeJwt.sign).toHaveBeenCalledWith({ key }, secret, { expiresIn: 1 });
    expect(fakeJwt.sign).toHaveBeenCalledTimes(1);
  });
});
