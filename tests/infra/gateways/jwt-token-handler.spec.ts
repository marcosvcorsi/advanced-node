import jwt from 'jsonwebtoken';

import { JwtTokenHandler } from '@/infra/gateways';

jest.mock('jsonwebtoken');

describe('JwtTokenHandler', () => {
  let key: string;
  let secret: string;
  let token: string;

  let fakeJwt: jest.Mocked<typeof jwt>;

  let sut: JwtTokenHandler;

  beforeAll(() => {
    fakeJwt = jwt as jest.Mocked<typeof jwt>;

    key = 'any_key';
    secret = 'any_secret';
    token = 'any_token';
  });

  beforeEach(() => {
    sut = new JwtTokenHandler(secret);
  });

  describe('generateToken', () => {
    let expirationInMs: number;

    beforeAll(() => {
      expirationInMs = 1000;

      fakeJwt.sign.mockImplementation(() => token);
    });

    it('should call jsonwebtoken sign with correct params', async () => {
      await sut.generate({ key, expirationInMs });

      expect(fakeJwt.sign).toHaveBeenCalledWith({ key }, secret, { expiresIn: 1 });
      expect(fakeJwt.sign).toHaveBeenCalledTimes(1);
    });

    it('should return a token', async () => {
      const result = await sut.generate({ key, expirationInMs });

      expect(result).toBe(token);
    });

    it('should throw if sign throws', async () => {
      fakeJwt.sign.mockImplementationOnce(() => {
        throw new Error('sign_error');
      });

      await expect(sut.generate({ key, expirationInMs })).rejects.toThrow(new Error('sign_error'));
    });
  });

  describe('validate', () => {
    beforeAll(() => {
      fakeJwt.verify.mockImplementation(() => ({ key }));
    });

    it('should call verify with correct params', async () => {
      await sut.validate({ token });

      expect(jwt.verify).toHaveBeenCalledWith(token, secret);
    });

    it('should return the key used to sign', async () => {
      const result = await sut.validate({ token });

      expect(result).toBe(key);
    });

    it('should throw if verify throws', async () => {
      fakeJwt.verify.mockImplementationOnce(() => {
        throw new Error('verify_error');
      });

      await expect(sut.validate({ token })).rejects.toThrow(new Error('verify_error'));
    });

    it('should throw if verify returns null', async () => {
      fakeJwt.verify.mockImplementationOnce(() => null);

      await expect(sut.validate({ token })).rejects.toThrow();
    });
  });
});
