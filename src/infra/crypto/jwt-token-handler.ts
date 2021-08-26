import jwt from 'jsonwebtoken';

import { TokenGenerator, TokenValidator } from '@/domain/contracts/crypto';

export class JwtTokenHandler implements TokenGenerator, TokenValidator {
  constructor(
    private readonly secret: string,
  ) {}

  async generateToken(params: TokenGenerator.Params): Promise<TokenGenerator.Result> {
    const { key, expirationInMs } = params;

    const expiresInSeconds = expirationInMs / 1000;

    const token = jwt.sign({ key }, this.secret, { expiresIn: expiresInSeconds });

    return token;
  }

  async validate(params: TokenValidator.Params): Promise<string> {
    const { token } = params;

    await jwt.verify(token, this.secret);

    return '';
  }
}
