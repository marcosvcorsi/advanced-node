import axios from 'axios';

import { AxiosHttpClient } from '@/infra/http';

jest.mock('axios');

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

  it('should throw if get throws', async () => {
    fakeAxios.get.mockRejectedValueOnce(new Error('http_error'));

    await expect(sut.get({
      url,
      params,
    })).rejects.toThrow(new Error('http_error'));
  });
});
