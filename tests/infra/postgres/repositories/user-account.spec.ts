import { IBackup, newDb } from 'pg-mem';
import {
  Column,
  Entity,
  getConnection,
  getRepository,
  PrimaryGeneratedColumn,
  Repository,
} from 'typeorm';

import { LoadUserAccountRepository } from '@/data/contracts/repositories';

class PgUserAccountRepository implements LoadUserAccountRepository {
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

@Entity('users')
class PgUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  name?: string;

  @Column()
  email!: string;

  @Column({ name: 'facebook_id', nullable: true })
  facebookId?: string;
}

describe('PgUserAccountRepository', () => {
  let pgUserRepository: Repository<PgUser>;
  let sut: PgUserAccountRepository;

  let backup: IBackup;

  beforeAll(async () => {
    const db = newDb();
    const connection = await db.adapters.createTypeormConnection({
      type: 'postgres',
      entities: [PgUser],
    });

    await connection.synchronize();

    backup = db.backup();

    pgUserRepository = getRepository(PgUser);
  });

  afterAll(() => {
    getConnection().close();
  });

  beforeEach(() => {
    backup.restore();

    sut = new PgUserAccountRepository();
  });

  describe('load()', () => {
    it('should return an account when email exists', async () => {
      await pgUserRepository.save({ email: 'existing_email@mail.com' });

      const account = await sut.load({ email: 'existing_email@mail.com' });

      expect(account).toEqual({
        id: '1',
        name: null,
      });
    });

    it('should return undefined when email doest not exists', async () => {
      const account = await sut.load({ email: 'new_email@mail.com' });

      expect(account).toBeUndefined();
    });
  });
});
