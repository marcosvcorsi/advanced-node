import { mock, MockProxy } from 'jest-mock-extended';

import { LoadFacebookUserApi } from '@/data/contracts/apis';

class FacebookApi {
  private readonly baseUrl = 'https://graph.facebook.com';

  constructor(
    private readonly httpClient: HttpGetClient,
  ) { }

  async loadUser(params: LoadFacebookUserApi.Params): Promise<void> {
    console.log(params);

    await this.httpClient.get({ url: `${this.baseUrl}/oauth/access_token` });
  }
}

interface HttpGetClient {
  get: (params: HttpGetClient.Params) => Promise<HttpGetClient.Result>;
}

namespace HttpGetClient {
  export type Params = {
    url: string
  }

  export type Result = void
}

describe('FacebookApi', () => {
  let httpClient: MockProxy<HttpGetClient>;

  let sut: FacebookApi;

  beforeAll(() => {
    httpClient = mock<HttpGetClient>();
  });

  beforeEach(() => {
    sut = new FacebookApi(httpClient);
  });

  it('should get app token', async () => {
    await sut.loadUser({ token: 'any_client_token' });

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oauth/access_token',
    });
  });
});
