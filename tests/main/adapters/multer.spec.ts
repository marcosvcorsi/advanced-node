import {
  NextFunction, Request, Response,
} from 'express';
import multer from 'multer';
import { mocked } from 'ts-jest/utils';

import { ServerError } from '@/application/errors';
import { adaptMulter } from '@/main/adapters';
import { getMockReq, getMockRes } from '@jest-mock/express';

jest.mock('multer');

describe('MulterAdapter', () => {
  let uploadSpy: jest.Mock;
  let singleSpy: jest.Mock;
  let multerSpy: jest.Mock;
  let fakeMulter: jest.Mocked<typeof multer>;
  let req: Request;
  let res: Response;
  let next: NextFunction;
  let buffer: Buffer;
  let mimetype: string;

  beforeAll(() => {
    buffer = Buffer.from('any_buffer');
    mimetype = 'any_mimetype';

    uploadSpy = jest.fn().mockImplementation((req, res, next) => {
      req.file = {
        buffer,
        mimetype,
      };

      next();
    });
    singleSpy = jest.fn().mockImplementation(() => uploadSpy);

    multerSpy = jest.fn().mockImplementation(() => ({
      single: singleSpy,
    }));

    fakeMulter = multer as jest.Mocked<typeof multer>;

    mocked(fakeMulter).mockImplementation(multerSpy);

    const resMock = getMockRes();

    res = resMock.res;
    next = resMock.next;
  });

  beforeEach(() => {
    req = getMockReq({ locals: { anyLocals: 'any_locals' } });
  });

  it('should call single upload with correct params', () => {
    adaptMulter(req, res, next);

    expect(multerSpy).toHaveBeenCalled();
    expect(multerSpy).toHaveBeenCalledTimes(1);
    expect(singleSpy).toHaveBeenCalledWith('picture');
    expect(singleSpy).toHaveBeenCalledTimes(1);
    expect(uploadSpy).toHaveBeenCalledWith(req, res, expect.any(Function));
    expect(uploadSpy).toHaveBeenCalledTimes(1);
  });

  it('should return 500 if upload fails', () => {
    const error = new Error('any_multer_error');

    uploadSpy.mockImplementationOnce((req, res, next) => {
      next(error);
    });

    adaptMulter(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ error: new ServerError(error) });
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  it('should not add file to request locals', () => {
    uploadSpy.mockImplementationOnce((req, res, next) => {
      next();
    });

    adaptMulter(req, res, next);

    expect(req.locals).toEqual({ anyLocals: 'any_locals' });
  });

  it('should add file to request locals', () => {
    adaptMulter(req, res, next);

    expect(req.locals).toEqual({
      anyLocals: 'any_locals',
      file: {
        buffer: req.file?.buffer,
        mimeType: req.file?.mimetype,
      },
    });
  });

  it('should call next on success', () => {
    adaptMulter(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });
});
