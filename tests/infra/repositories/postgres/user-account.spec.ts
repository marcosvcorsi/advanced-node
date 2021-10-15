import { IBackup } from 'pg-mem';
import {
  getConnection,
  getRepository,
  Repository,
} from 'typeorm';

import { makeInMemoryDb } from '@/../tests/infra/repositories/postgres/mocks';
import { PgUserAccountRepository } from '@/infra/repositories/postgres';
import { PgUser } from '@/infra/repositories/postgres/entities';

describe('PgUserAccountRepository', () => {
  let pgUserRepository: Repository<PgUser>;
  let sut: PgUserAccountRepository;

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

    sut = new PgUserAccountRepository();
  });

  describe('load()', () => {
    it('should return an account when email exists', async () => {
      await pgUserRepository.save({ email: 'existing_email@mail.com' });

      const account = await sut.load({ email: 'existing_email@mail.com' });

      expect(account).toHaveProperty('id');
      expect(account).toHaveProperty('name');
    });

    it('should return undefined when email doest not exists', async () => {
      const account = await sut.load({ email: 'new_email@mail.com' });

      expect(account).toBeUndefined();
    });
  });

  describe('saveWithFacebok()', () => {
    it('should create an account when id is not passed', async () => {
      const { id } = await sut.saveWithFacebook({
        email: 'any_mail@mail.com',
        name: 'any_name',
        facebookId: 'any_fb_id',
      });

      const pgUser = await pgUserRepository.findOne({ email: 'any_mail@mail.com' });

      expect(pgUser?.id).toBeDefined();
      expect(id).toBe(String(pgUser?.id));
    });

    it('should update an account when id passed', async () => {
      const user = await pgUserRepository.save({
        email: 'any_mail@mail.com',
        name: 'any_name',
        facebookId: 'any_fb_id',
      });

      const { id } = await sut.saveWithFacebook({
        id: String(user.id),
        email: 'new_mail@mail.com',
        name: 'new_name',
        facebookId: 'new_fb_id',
      });

      const pgUser = await pgUserRepository.findOne({ id: user.id });

      expect(pgUser).toMatchObject({
        id: user.id,
        email: 'any_mail@mail.com',
        name: 'new_name',
        facebookId: 'new_fb_id',
      });
      expect(id).toBe(String(pgUser?.id));
    });
  });
});
