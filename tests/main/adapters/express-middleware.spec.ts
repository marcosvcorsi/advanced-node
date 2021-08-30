import {
  NextFunction, Request, RequestHandler, Response,
} from 'express';
import { mock, MockProxy } from 'jest-mock-extended';

import { HttpResponse } from '@/application/helpers';
import { getMockReq, getMockRes } from '@jest-mock/express';

interface Middleware {
  handle: (httpRequest: Record<string, unknown>) => Promise<HttpResponse>;
}

type ExpressMiddleware = (middleware: Middleware) => RequestHandler;

const adaptExpressMiddleware: ExpressMiddleware = (middleware) => async (req, res, _next) => {
  const { headers } = req;

  const { statusCode, data } = await middleware.handle(headers);

  res.status(statusCode).send(data);
};

describe('ExpressMiddleware', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;
  let headers: Record<string, unknown>;
  let middleware: MockProxy<Middleware>;

  let sut: RequestHandler;

  beforeAll(() => {
    headers = {
      authorization: 'any_auth',
    };

    req = getMockReq({ headers });
    res = getMockRes().res;
    next = getMockRes().next;

    middleware = mock();
    middleware.handle.mockResolvedValue({
      statusCode: 200,
      data: {
        message: 'any_message',
      },
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
    const emptyReq = getMockReq();

    await sut(emptyReq, res, next);

    expect(middleware.handle).toHaveBeenCalledWith({});
    expect(middleware.handle).toHaveBeenCalledTimes(1);
  });

  it('should respond error and status code', async () => {
    const data = {
      error: 'any_error',
    };

    middleware.handle.mockResolvedValue({
      statusCode: 500,
      data,
    });

    await sut(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith(data);
    expect(res.send).toHaveBeenCalledTimes(1);
  });
});
