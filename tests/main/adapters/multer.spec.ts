import {
  NextFunction, Request, RequestHandler, Response,
} from 'express';
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
  let uploadSpy: jest.Mock;
  let singleSpy: jest.Mock;
  let multerSpy: jest.Mock;
  let fakeMulter: jest.Mocked<typeof multer>;
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeAll(() => {
    uploadSpy = jest.fn();
    singleSpy = jest.fn().mockImplementation(() => uploadSpy);

    multerSpy = jest.fn().mockImplementation(() => ({
      single: singleSpy,
    }));

    fakeMulter = multer as jest.Mocked<typeof multer>;

    mocked(fakeMulter).mockImplementation(multerSpy);

    req = getMockReq();

    const resMock = getMockRes();

    res = resMock.res;
    next = resMock.next;
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
});
