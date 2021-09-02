import { RequestHandler } from 'express';

import { Middleware } from '@/application/middlewares';

export type ExpressMiddleware = (middleware: Middleware) => RequestHandler;

export const adaptExpressMiddleware: ExpressMiddleware = (middleware) => async (req, res, next) => {
  const { headers } = req;

  const { statusCode, data } = await middleware.handle(headers);

  if (statusCode >= 400) {
    return res.status(statusCode).send({ error: data.message });
  }

  req.locals = {
    ...req.locals,
    ...Object
      .entries(data)
      .reduce((acc, [key, value]) => (value ? { ...acc, [key]: value } : acc), {}),
  };

  return next();
};
