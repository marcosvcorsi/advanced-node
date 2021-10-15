import { getRepository } from 'typeorm';

import { LoadUserProfileRepository, SaveUserPictureRepository } from '@/domain/contracts/repositories';
import { PgUser } from '@/infra/repositories/postgres/entities';

export class PgUserProfileRepository implements SaveUserPictureRepository, LoadUserProfileRepository {
  async savePicture({ id, pictureUrl, initials }: SaveUserPictureRepository.Params): Promise<void> {
    const pgUserRepository = getRepository(PgUser);

    await pgUserRepository.update(Number(id), {
      pictureUrl,
      initials,
    });
  }

  async load({ id }: LoadUserProfileRepository.Params): Promise<LoadUserProfileRepository.Result> {
    const pgUserRepository = getRepository(PgUser);

    const pgUser = await pgUserRepository.findOne(Number(id));

    if (!pgUser) {
      return;
    }

    return {
      name: pgUser.name,
    };
  }
}
