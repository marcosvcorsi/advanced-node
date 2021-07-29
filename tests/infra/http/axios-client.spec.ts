import axios from 'axios';

import { HttpGetClient } from '@/infra/http';

jest.mock('axios');

class AxiosHttpClient {
  async get<T = any>({ url, params } : HttpGetClient.Params): Promise<T> {
    const { data } = await axios.get<T>(url, { params });

    return data;
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

    fakeAxios.get.mockResolvedValue({
      status: 200,
      data: {
        any: 'any_data',
      },
    });
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

  it('should return data on success', async () => {
    const result = await sut.get({
      url,
      params,
    });

    expect(result).toEqual({ any: 'any_data' });
  });

  it('should throw if get thros', async () => {
    fakeAxios.get.mockRejectedValueOnce(new Error('http_error'));

    await expect(sut.get({
      url,
      params,
    })).rejects.toThrow(new Error('http_error'));
  });
});
