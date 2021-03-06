import { IBackup } from 'pg-mem';
import { Repository } from 'typeorm';

import { makeInMemoryDb } from '@/../tests/infra/repositories/postgres/mocks';
import { PgRepository, PgUserProfileRepository } from '@/infra/repositories/postgres';
import { PgUser } from '@/infra/repositories/postgres/entities';
import { PgConnection } from '@/infra/repositories/postgres/helpers';

describe('PgUserProfileRepository', () => {
  let connection: PgConnection;
  let pgUserRepository: Repository<PgUser>;
  let sut: PgUserProfileRepository;

  let backup: IBackup;

  beforeAll(async () => {
    connection = PgConnection.getInstance();
    const db = await makeInMemoryDb([PgUser]);

    backup = db.backup();

    pgUserRepository = connection.getRepository(PgUser);
  });

  afterAll(async () => {
    await connection.disconnect();
  });

  beforeEach(() => {
    backup.restore();

    sut = new PgUserProfileRepository();
  });

  it('should extends PgRepository', () => {
    expect(sut).toBeInstanceOf(PgRepository);
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

  describe('load()', () => {
    it('should load user profile', async () => {
      const name = 'any_name';

      const { id } = await pgUserRepository.save({
        email: 'any_mail@mail.com',
        name,
      });

      const result = await sut.load({ id: String(id) });

      expect(result).toEqual({ name });
    });

    it('should return undefined when user profile not exists', async () => {
      const result = await sut.load({ id: '1' });

      expect(result).toBeUndefined();
    });
  });
});
