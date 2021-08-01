import { getRepository, Repository } from 'typeorm';

import { LoadUserAccountRepository } from '@/data/contracts/repositories';
import { PgUser } from '@/infra/postgres/entities';

export class PgUserAccountRepository implements LoadUserAccountRepository {
  private pgUserRepository: Repository<PgUser>;

  constructor() {
    this.pgUserRepository = getRepository(PgUser);
  }

  async load({ email }: LoadUserAccountRepository.Params):
    Promise<LoadUserAccountRepository.Result> {
    const pgUser = await this.pgUserRepository.findOne({
      email,
    });

    if (!pgUser) {
      return undefined;
    }

    return {
      id: String(pgUser.id),
      name: pgUser.name,
    };
  }
}
