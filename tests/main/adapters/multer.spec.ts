import { RequestHandler } from 'express';
import multer from 'multer';
import { mocked } from 'ts-jest/utils';

import { getMockReq, getMockRes } from '@jest-mock/express';

jest.mock('multer');

const adaptMulter: RequestHandler = (req, res, next) => {
  const upload = multer().single('picture');

  upload(req, res, () => {
    next();
  });
};

describe('MulterAdapter', () => {
  it('should call single upload with correct params', () => {
    const fakeMulter = multer as jest.Mocked<typeof multer>;

    const uploadSpy = jest.fn();
    const singleSpy = jest.fn().mockImplementation(() => uploadSpy);
    const multerSpy = jest.fn().mockImplementation(() => ({
      single: singleSpy,
    }));

    mocked(fakeMulter).mockImplementation(multerSpy);

    const req = getMockReq();
    const { res, next } = getMockRes();

    adaptMulter(req, res, next);

    expect(multerSpy).toHaveBeenCalled();
    expect(multerSpy).toHaveBeenCalledTimes(1);
    expect(singleSpy).toHaveBeenCalledWith('picture');
    expect(singleSpy).toHaveBeenCalledTimes(1);
    expect(uploadSpy).toHaveBeenCalledWith(req, res, expect.any(Function));
    expect(uploadSpy).toHaveBeenCalledTimes(1);
  });
});
