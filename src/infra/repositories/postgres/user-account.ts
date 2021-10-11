import { getRepository } from 'typeorm';

import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/domain/contracts/repositories';
import { PgUser } from '@/infra/repositories/postgres/entities';

export class PgUserAccountRepository implements
  LoadUserAccountRepository, SaveFacebookAccountRepository {
  async saveWithFacebook(params: SaveFacebookAccountRepository.Params):
    Promise<SaveFacebookAccountRepository.Result> {
    const pgUserRepository = getRepository(PgUser);

    const {
      id,
      email,
      name,
      facebookId,
    } = params;

    if (id) {
      await pgUserRepository.update({
        id: Number(id),
      }, {
        name,
        facebookId,
      });

      return { id };
    }
    const pgUser = await pgUserRepository.save({
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
    const pgUserRepository = getRepository(PgUser);

    const pgUser = await pgUserRepository.findOne({
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
