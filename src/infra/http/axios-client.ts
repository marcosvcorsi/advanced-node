import axios from 'axios';

import { HttpGetClient } from '@/infra/http';

export class AxiosHttpClient {
  async get<T = any>({ url, params } : HttpGetClient.Params): Promise<T> {
    const { data } = await axios.get<T>(url, { params });

    return data;
  }
}
