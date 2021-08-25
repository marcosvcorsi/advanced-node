import jwt from 'jsonwebtoken';

import { JwtTokenHandler } from '@/infra/crypto';

jest.mock('jsonwebtoken');

describe('JwtTokenHandler', () => {
  let key: string;
  let expirationInMs: number;
  let secret: string;

  let fakeJwt: jest.Mocked<typeof jwt>;

  let sut: JwtTokenHandler;

  beforeAll(() => {
    fakeJwt = jwt as jest.Mocked<typeof jwt>;

    key = 'any_key';
    expirationInMs = 1000;
    secret = 'any_secret';

    fakeJwt.sign.mockImplementation(() => 'any_token');
  });

  beforeEach(() => {
    sut = new JwtTokenHandler(secret);
  });

  it('should call jsonwebtoken sign with correct params', async () => {
    await sut.generateToken({ key, expirationInMs });

    expect(fakeJwt.sign).toHaveBeenCalledWith({ key }, secret, { expiresIn: 1 });
    expect(fakeJwt.sign).toHaveBeenCalledTimes(1);
  });

  it('should return a token', async () => {
    const result = await sut.generateToken({ key, expirationInMs });

    expect(result).toBe('any_token');
  });

  it('should throw if sign throws', async () => {
    fakeJwt.sign.mockImplementationOnce(() => {
      throw new Error('sign_error');
    });

    await expect(sut.generateToken({ key, expirationInMs })).rejects.toThrow(new Error('sign_error'));
  });
});
