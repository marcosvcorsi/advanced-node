import { LoadUserProfileRepository, SaveUserPictureRepository } from '@/domain/contracts/repositories';
import { PgUser } from '@/infra/repositories/postgres/entities';

import { PgRepository } from './repository';

export class PgUserProfileRepository extends PgRepository implements SaveUserPictureRepository, LoadUserProfileRepository {
  async savePicture({ id, pictureUrl, initials }: SaveUserPictureRepository.Params): Promise<void> {
    const pgUserRepository = this.getRepository(PgUser);

    await pgUserRepository.update(Number(id), {
      pictureUrl,
      initials,
    });
  }

  async load({ id }: LoadUserProfileRepository.Params): Promise<LoadUserProfileRepository.Result> {
    const pgUserRepository = this.getRepository(PgUser);

    const pgUser = await pgUserRepository.findOne(Number(id));

    if (!pgUser) {
      return;
    }

    return {
      name: pgUser.name,
    };
  }
}
