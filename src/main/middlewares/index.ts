import cors from 'cors';
import express, { Express } from 'express';

export const setupMiddlewares = (app: Express): void => {
  app.use(cors());
  app.use(express.json());
};
