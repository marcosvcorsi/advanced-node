import { PgUserAccountRepository } from '@/infra/repositories/postgres';

const makePgUserAccountRepository = (): PgUserAccountRepository => new PgUserAccountRepository();

export { makePgUserAccountRepository };
