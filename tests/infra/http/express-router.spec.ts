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

    await this.controller.handle({ ...body });

    return response.send();
  }
}

describe('ExpressRouter', () => {
  let controller: MockProxy<Controller>;

  let sut: ExpressRouter;

  beforeAll(() => {
    controller = mock();
  });

  beforeEach(() => {
    sut = new ExpressRouter(controller);
  });

  it('should call handle with correct request', async () => {
    const body = { any: 'any' };

    const req = getMockReq({ body });

    const { res } = getMockRes();

    await sut.adapt(req, res);

    expect(controller.handle).toHaveBeenCalled();
  });

  it('should call handle with empty body', async () => {
    const req = getMockReq();

    const { res } = getMockRes();

    await sut.adapt(req, res);

    expect(controller.handle).toHaveBeenCalled();
  });
});
