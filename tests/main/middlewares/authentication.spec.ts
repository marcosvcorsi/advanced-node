import request from 'supertest';

import { UnauthorizedError } from '@/application/errors';
import { app } from '@/main/app';
import { auth } from '@/main/middlewares/authentication';

describe('AuthenticationMiddleware', () => {
  beforeAll(() => {
    app.get('/fake_route', auth, (req, res) => res.send('OK'));
  });

  it('should return 401 if authorization header was not provided', async () => {
    const response = await request(app)
      .get('/fake_route');

    expect(response.status).toBe(401);
    expect(response.body.error).toBe(new UnauthorizedError().message);
  });
});
