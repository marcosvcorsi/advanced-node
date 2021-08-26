import jwt, { JwtPayload } from 'jsonwebtoken';

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

  async validate(params: TokenValidator.Params): Promise<TokenValidator.Result> {
    const { token } = params;

    const { key } = await jwt.verify(token, this.secret) as JwtPayload;

    return key;
  }
}
