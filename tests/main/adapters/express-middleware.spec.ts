import {
  NextFunction, Request, RequestHandler, Response,
} from 'express';
import { mock, MockProxy } from 'jest-mock-extended';

import { Middleware } from '@/application/middlewares';
import { adaptExpressMiddleware } from '@/main/adapters';
import { getMockReq, getMockRes } from '@jest-mock/express';

describe('ExpressMiddleware', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;
  let headers: Record<string, unknown>;
  let data: Record<string, unknown>;
  let middleware: MockProxy<Middleware>;

  let sut: RequestHandler;

  beforeAll(() => {
    headers = {
      authorization: 'any_auth',
    };

    req = getMockReq({ headers });
    res = getMockRes().res;
    next = getMockRes().next;

    data = {
      emptyProp: '',
      nullProp: null,
      undefinedProp: undefined,
      prop: 'any_value',
    };

    middleware = mock();
    middleware.handle.mockResolvedValue({
      statusCode: 200,
      data,
    });
  });

  beforeEach(() => {
    sut = adaptExpressMiddleware(middleware);
  });

  it('should call handle with correct request', async () => {
    await sut(req, res, next);

    expect(middleware.handle).toHaveBeenCalledWith(headers);
    expect(middleware.handle).toHaveBeenCalledTimes(1);
  });

  it('should call handle with correct request', async () => {
    req = getMockReq();

    await sut(req, res, next);

    expect(middleware.handle).toHaveBeenCalledWith({});
    expect(middleware.handle).toHaveBeenCalledTimes(1);
  });

  it('should respond error and status code', async () => {
    const errorData = {
      error: 'any_error',
    };

    middleware.handle.mockResolvedValueOnce({
      statusCode: 500,
      data: errorData,
    });

    await sut(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith(errorData);
    expect(res.send).toHaveBeenCalledTimes(1);
  });

  it('should add valid data to request locals on success', async () => {
    await sut(req, res, next);

    expect(req.locals).toEqual({ prop: data.prop });
    expect(next).toHaveReturnedTimes(1);
  });
});
