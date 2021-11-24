import { IBackup } from 'pg-mem';
import request from 'supertest';
import { getConnection } from 'typeorm';

import { PgUser } from '@/infra/repositories/postgres/entities';
import { app } from '@/main/app';
import { makeInMemoryDb } from '@/tests/infra/repositories/postgres/mocks';

describe('Users Routes', () => {
  let backup: IBackup;

  beforeAll(async () => {
    const db = await makeInMemoryDb([PgUser]);

    backup = db.backup();
  });

  afterAll(async () => {
    await getConnection().close();
  });

  beforeEach(() => {
    backup.restore();
  });

  describe('DELETE /users/picture', () => {
    it('should return 401 when authorization header is not present', async () => {
      const response = await request(app)
        .delete('/api/users/picture');

      expect(response.status).toBe(401);
    });
  });
});
