import { RequestHandler } from 'express';

import { Controller } from '@/application/controllers';

export const adaptExpressRouter = (controller: Controller): RequestHandler => async (req, res) => {
  const { body } = req;

  const { statusCode, data } = await controller.handle({ ...body });

  if (statusCode >= 400) {
    return res.status(statusCode).json({ error: data.message });
  }

  return res.status(statusCode).json(data);
};
