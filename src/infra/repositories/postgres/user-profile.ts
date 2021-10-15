import { getRepository } from 'typeorm';

import { SaveUserPictureRepository } from '@/domain/contracts/repositories';
import { PgUser } from '@/infra/repositories/postgres/entities';

export class PgUserProfileRepository implements SaveUserPictureRepository {
  async savePicture({ id, pictureUrl, initials }: SaveUserPictureRepository.Params): Promise<void> {
    const pgUserRepository = getRepository(PgUser);

    await pgUserRepository.update(Number(id), {
      pictureUrl,
      initials,
    });
  }
}
