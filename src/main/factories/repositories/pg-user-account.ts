import { PgUserAccountRepository } from '@/infra/postgres/repositories';

const makePgUserAccountRepository = (): PgUserAccountRepository => new PgUserAccountRepository();

export { makePgUserAccountRepository };
