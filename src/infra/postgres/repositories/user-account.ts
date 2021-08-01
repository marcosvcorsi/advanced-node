import { getRepository, Repository } from 'typeorm';

import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repositories';
import { PgUser } from '@/infra/postgres/entities';

export class PgUserAccountRepository implements
  LoadUserAccountRepository, SaveFacebookAccountRepository {
  private pgUserRepository: Repository<PgUser>;

  constructor() {
    this.pgUserRepository = getRepository(PgUser);
  }

  async saveWithFacebook(params: SaveFacebookAccountRepository.Params):
    Promise<SaveFacebookAccountRepository.Result> {
    const {
      id,
      email,
      name,
      facebookId,
    } = params;

    if (id) {
      await this.pgUserRepository.update({
        id: Number(id),
      }, {
        name,
        facebookId,
      });

      return { id };
    }
    const pgUser = await this.pgUserRepository.save({
      email,
      name,
      facebookId,
    });

    return {
      id: String(pgUser.id),
    };
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
