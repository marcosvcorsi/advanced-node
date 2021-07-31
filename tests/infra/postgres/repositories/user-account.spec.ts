import { newDb } from 'pg-mem';
import {
  Column,
  Entity,
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
      id: pgUser.id.toString(),
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

  beforeAll(async () => {
    const db = newDb();
    const connection = await db.adapters.createTypeormConnection({
      type: 'postgres',
      entities: [PgUser],
    });

    // create schema
    await connection.synchronize();

    pgUserRepository = getRepository(PgUser);

    await pgUserRepository.save({ email: 'existing_email@mail.com' });
  });

  beforeEach(() => {
    sut = new PgUserAccountRepository();
  });

  describe('load()', () => {
    it('should return an account when email exists', async () => {
      const account = await sut.load({ email: 'existing_email@mail.com' });

      expect(account).toEqual({
        id: '1',
        name: null,
      });
    });
  });
});
