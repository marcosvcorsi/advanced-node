import axios from 'axios';

import { HttpGetClient } from '@/infra/gateways';

export class AxiosHttpClient implements HttpGetClient {
  async get<T = any>({ url, params } : HttpGetClient.Params): Promise<T> {
    const { data } = await axios.get<T>(url, { params });

    return data;
  }
}
