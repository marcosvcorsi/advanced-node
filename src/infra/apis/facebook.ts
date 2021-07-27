import { LoadFacebookUserApi } from '@/data/contracts/apis';
import { HttpGetClient } from '@/infra/http';

export class FacebookApi {
  private readonly baseUrl = 'https://graph.facebook.com';

  constructor(
    private readonly httpClient: HttpGetClient,
    private readonly clientId: string,
    private readonly clientSecret: string,
  ) { }

  async loadUser(params: LoadFacebookUserApi.Params): Promise<void> {
    console.log(params);

    await this.httpClient.get({
      url: `${this.baseUrl}/oauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials',
      },
    });
  }
}
