import { JwtTokenHandler } from '@/infra/crypto';
import { env } from '@/main/config/env';

export const makeJwtTokenHandler = (): JwtTokenHandler => new JwtTokenHandler(env.jwtSecret);
