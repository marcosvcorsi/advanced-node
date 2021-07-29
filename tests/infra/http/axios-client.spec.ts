import axios from 'axios';

import { HttpGetClient } from '@/infra/http';

jest.mock('axios');

class AxiosHttpClient {
  async get({ url, params } : HttpGetClient.Params): Promise<void> {
    await axios.get(url, { params });
  }
}

describe('AxiosHttpClient', () => {
  const fakeAxios = axios as jest.Mocked<typeof axios>;

  let sut: AxiosHttpClient;

  beforeEach(() => {
    sut = new AxiosHttpClient();
  });

  it('should call get with correct params', async () => {
    await sut.get({
      url: 'http://any-url.com',
      params: {
        any: 'any',
      },
    });

    expect(fakeAxios.get).toHaveBeenCalledWith('http://any-url.com', {
      params: {
        any: 'any',
      },
    });
    expect(fakeAxios.get).toHaveBeenCalledTimes(1);
  });
});
