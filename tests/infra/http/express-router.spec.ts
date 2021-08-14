import { Request, Response } from 'express';
import { mock, MockProxy } from 'jest-mock-extended';

import { Controller } from '@/application/controllers';
import { getMockReq, getMockRes } from '@jest-mock/express';

class ExpressRouter {
  constructor(
    private readonly controller: Controller,
  ) { }

  async adapt(request: Request, response: Response): Promise<Response> {
    const { body } = request;

    const { statusCode, data } = await this.controller.handle({ ...body });

    return response.status(statusCode).json(data);
  }
}

describe('ExpressRouter', () => {
  let req: Request;
  let res: Response;
  let controller: MockProxy<Controller>;
  let body: any;

  let sut: ExpressRouter;

  beforeAll(() => {
    controller = mock();
  });

  beforeEach(() => {
    body = { any: 'any' };

    req = getMockReq({ body });
    res = getMockRes().res;

    controller.handle.mockResolvedValue({
      statusCode: 200,
      data: {
        any: 'data',
      },
    });

    sut = new ExpressRouter(controller);
  });

  it('should call handle with correct request', async () => {
    await sut.adapt(req, res);

    expect(controller.handle).toHaveBeenCalledWith(body);
    expect(controller.handle).toHaveBeenCalledTimes(1);
  });

  it('should call handle with empty body', async () => {
    const req = getMockReq();

    await sut.adapt(req, res);

    expect(controller.handle).toHaveBeenCalledWith({});
    expect(controller.handle).toHaveBeenCalledTimes(1);
  });

  it('should response with 200 and valid data', async () => {
    await sut.adapt(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ any: 'data' });
    expect(res.json).toHaveBeenCalledTimes(1);
  });
});
