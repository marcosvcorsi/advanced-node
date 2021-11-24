import { PgUserProfileRepository } from '@/infra/repositories/postgres';

export const makePgUserProfileRepository = (): PgUserProfileRepository => new PgUserProfileRepository();
