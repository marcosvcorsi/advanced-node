import { RequestHandler } from 'express';
import multer from 'multer';

import { ServerError } from '@/application/errors';

export const adaptMulter: RequestHandler = (req, res, next) => {
  const upload = multer().single('picture');

  upload(req, res, (error) => {
    if (error) {
      return res.status(500).json({ error: new ServerError(error) });
    }

    if (req.file) {
      req.locals = {
        ...req.locals,
        file: {
          buffer: req.file.buffer,
          mimeType: req.file.mimetype,
        },
      };
    }

    next();
  });
};
