import { IBackup } from 'pg-mem';
import request from 'supertest';
import { getConnection } from 'typeorm';

import { UnauthorizedError } from '@/application/errors';
import { PgUser } from '@/infra/postgres/entities';
import { app } from '@/main/app';
import { makeInMemoryDb } from '@/tests/infra/postgres/mocks';

describe('Login Routes', () => {
  let backup: IBackup;

  const loadUserSpy = jest.fn();

  jest.mock('@/infra/apis/facebook', () => ({
    FacebookApi: jest.fn().mockReturnValue({
      loadUser: loadUserSpy,
    }),
  }));

  beforeAll(async () => {
    const db = await makeInMemoryDb([PgUser]);

    backup = db.backup();

    loadUserSpy.mockResolvedValue({
      facebookId: 'any_fb_id',
      name: 'any_name',
      email: 'any_mail@mail.com',
    });
  });

  afterAll(async () => {
    await getConnection().close();
  });

  beforeEach(() => {
    backup.restore();
  });

  describe('POST /login/facebook', () => {
    it('should return 200 with AccessToken', async () => {
      const response = await request(app)
        .post('/api/login/facebook')
        .send({
          token: 'valid_token',
        });

      expect(response.status).toBe(200);
      expect(response.body.accessToken).toBeDefined();
    });

    it('should return 401 with an Unauthorized error', async () => {
      loadUserSpy.mockResolvedValueOnce(undefined);

      const response = await request(app)
        .post('/api/login/facebook')
        .send({
          token: 'invalid_token',
        });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: new UnauthorizedError().message });
    });
  });
});
