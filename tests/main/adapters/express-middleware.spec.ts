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

const adaptExpressMiddleware: ExpressMiddleware = (middleware) => async (req, _res, _next) => {
  const { headers } = req;

  await middleware.handle(headers);
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
});
