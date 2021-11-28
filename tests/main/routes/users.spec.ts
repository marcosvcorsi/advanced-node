import { sign } from 'jsonwebtoken';
import { IBackup } from 'pg-mem';
import request from 'supertest';
import { Repository } from 'typeorm';

import { PgUser } from '@/infra/repositories/postgres/entities';
import { PgConnection } from '@/infra/repositories/postgres/helpers';
import { app } from '@/main/app';
import { env } from '@/main/config/env';
import { makeInMemoryDb } from '@/tests/infra/repositories/postgres/mocks';

describe('Users Routes', () => {
  let connection: PgConnection;
  let backup: IBackup;
  let pgUserRepository: Repository<PgUser>;

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
  });

  describe('DELETE /users/picture', () => {
    it('should return 401 when authorization header is not present', async () => {
      const response = await request(app)
        .delete('/api/users/picture');

      expect(response.status).toBe(401);
    });

    it('should return 200 on success', async () => {
      const { id } = await pgUserRepository.save({
        email: 'any_mail@mail.com',
        name: 'John Doe',
      });

      const authorization = sign({ key: id }, env.jwtSecret);

      const response = await request(app)
        .delete('/api/users/picture')
        .set({ authorization });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ pictureUrl: undefined, initials: 'JD' });
    });
  });

  describe('PUT /users/picture', () => {
    const uploadSpy = jest.fn();

    jest.mock('@/infra/gateways/aws-s3-file-storage', () => ({
      AWSS3FileStorage: jest.fn().mockReturnValue({
        upload: uploadSpy,
      }),
    }));

    it('should return 401 when authorization header is not present', async () => {
      const response = await request(app)
        .put('/api/users/picture');

      expect(response.status).toBe(401);
    });

    it('should return 200 on success', async () => {
      const pictureUrl = 'any_url';

      uploadSpy.mockResolvedValueOnce(pictureUrl);

      const { id } = await pgUserRepository.save({
        email: 'any_mail@mail.com',
        name: 'John Doe',
      });

      const authorization = sign({ key: id }, env.jwtSecret);

      const response = await request(app)
        .put('/api/users/picture')
        .set({ authorization })
        .attach('picture', Buffer.from('any_buffer'), { filename: 'any_name', contentType: 'image/png' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ pictureUrl, initials: undefined });
    });
  });
});
