import { sign } from 'jsonwebtoken';
import request from 'supertest';

import { UnauthorizedError } from '@/application/errors';
import { app } from '@/main/app';
import { env } from '@/main/config/env';
import { auth } from '@/main/middlewares/authentication';

describe('AuthenticationMiddleware', () => {
  let userId: string;

  beforeAll(() => {
    userId = 'any_user_id';

    app.get('/fake_route', auth, (req, res) => res.json(req.locals));
  });

  it('should return 401 if authorization header was not provided', async () => {
    const response = await request(app)
      .get('/fake_route');

    expect(response.status).toBe(401);
    expect(response.body.error).toBe(new UnauthorizedError().message);
  });

  it('should return 200 if authorization header was provided', async () => {
    const token = sign({ key: userId }, env.jwtSecret);

    const response = await request(app)
      .get('/fake_route')
      .set('Authorization', token);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ userId });
  });
});
