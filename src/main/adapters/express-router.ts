import { RequestHandler } from 'express';

import { Controller } from '@/application/controllers';

type ExpressRouterAdapter = (controller: Controller) => RequestHandler;

export const adaptExpressRouter: ExpressRouterAdapter = (controller) => async (req, res) => {
  const { body, locals } = req;

  const { statusCode, data } = await controller.handle({ ...locals, ...body });

  if (statusCode >= 400) {
    return res.status(statusCode).json({ error: data.message });
  }

  return res.status(statusCode).json(data);
};
