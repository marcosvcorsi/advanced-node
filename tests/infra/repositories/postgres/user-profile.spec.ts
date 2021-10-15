import { IBackup } from 'pg-mem';
import {
  getConnection,
  getRepository,
  Repository,
} from 'typeorm';

import { makeInMemoryDb } from '@/../tests/infra/repositories/postgres/mocks';
import { PgUserProfileRepository } from '@/infra/repositories/postgres';
import { PgUser } from '@/infra/repositories/postgres/entities';

describe('PgUserProfileRepository', () => {
  let pgUserRepository: Repository<PgUser>;
  let sut: PgUserProfileRepository;

  let backup: IBackup;

  beforeAll(async () => {
    const db = await makeInMemoryDb([PgUser]);

    backup = db.backup();

    pgUserRepository = getRepository(PgUser);
  });

  afterAll(async () => {
    await getConnection().close();
  });

  beforeEach(() => {
    backup.restore();

    sut = new PgUserProfileRepository();
  });

  describe('savePicture()', () => {
    it('should update user profile', async () => {
      const { id } = await pgUserRepository.save({
        email: 'any_mail@mail.com',
        initials: 'any_initials',
      });

      const pictureUrl = 'any_url';

      await sut.savePicture({ id: String(id), pictureUrl });

      const pgUser = await pgUserRepository.findOne(id);

      expect(pgUser).toMatchObject({ id, pictureUrl, initials: null });
    });
  });
});
