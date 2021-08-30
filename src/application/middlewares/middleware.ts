import { HttpResponse } from '@/application/helpers';

export interface Middleware {
  handle: (httpRequest: Record<string, unknown>) => Promise<HttpResponse>;
}
