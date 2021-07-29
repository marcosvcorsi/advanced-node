import axios from 'axios';

import { HttpGetClient } from '@/infra/http';

jest.mock('axios');

class AxiosHttpClient {
  async get({ url, params } : HttpGetClient.Params): Promise<void> {
    await axios.get(url, { params });
  }
}

describe('AxiosHttpClient', () => {
  let fakeAxios: jest.Mocked<typeof axios>;

  let url: string;
  let params: object;

  let sut: AxiosHttpClient;

  beforeAll(() => {
    fakeAxios = axios as jest.Mocked<typeof axios>;

    url = 'http://any-url.com';
    params = { any: 'any' };
  });

  beforeEach(() => {
    sut = new AxiosHttpClient();
  });

  it('should call get with correct params', async () => {
    await sut.get({
      url,
      params,
    });

    expect(fakeAxios.get).toHaveBeenCalledWith(url, { params });
    expect(fakeAxios.get).toHaveBeenCalledTimes(1);
  });
});
