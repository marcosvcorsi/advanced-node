import { ServerError, UnauthorizedError } from '../errors';

export type HttpResponse<T = any> = {
  statusCode: number;
  data: T
}

export const ok = <T = any> (data: T): HttpResponse<T> => ({
  statusCode: 200,
  data,
});

export const noContent = (): HttpResponse => ({
  statusCode: 204,
  data: null,
});

export const badRequest = (error: Error): HttpResponse<Error> => ({
  statusCode: 400,
  data: error,
});

export const unauthorized = (): HttpResponse<UnauthorizedError> => ({
  statusCode: 401,
  data: new UnauthorizedError(),
});

export const serverError = (error: Error): HttpResponse<ServerError> => ({
  statusCode: 500,
  data: new ServerError(error),
});
