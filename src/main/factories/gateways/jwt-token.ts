import { JwtTokenHandler } from '@/infra/gateways';
import { env } from '@/main/config/env';

export const makeJwtTokenHandler = (): JwtTokenHandler => new JwtTokenHandler(env.jwtSecret);
