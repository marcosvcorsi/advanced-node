import jwt from 'jsonwebtoken';

import { TokenGenerator } from '@/data/contracts/crypto';

export class JwtTokenGenerator implements TokenGenerator {
  constructor(
    private readonly secret: string,
  ) {}

  async generateToken(params: TokenGenerator.Params): Promise<TokenGenerator.Result> {
    const { key, expirationInMs } = params;

    const expiresInSeconds = expirationInMs / 1000;

    const token = jwt.sign({ key }, this.secret, { expiresIn: expiresInSeconds });

    return token;
  }
}