import { Request, Response } from 'express';

import { Controller } from '@/application/controllers';

export class ExpressRouter {
  constructor(
    private readonly controller: Controller,
  ) { }

  async adapt(request: Request, response: Response): Promise<Response> {
    const { body } = request;

    const { statusCode, data } = await this.controller.handle({ ...body });

    if (statusCode >= 400) {
      return response.status(statusCode).json({ error: data.message });
    }

    return response.status(statusCode).json(data);
  }
}
