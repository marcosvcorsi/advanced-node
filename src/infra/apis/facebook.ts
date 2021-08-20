import { LoadFacebookUserApi } from '@/domain/contracts/apis';
import { HttpGetClient } from '@/infra/http';

type AppToken = {
  access_token: string;
}

type DebugToken = {
  data: {
    user_id: string
  }
}

export class FacebookApi implements LoadFacebookUserApi {
  private readonly baseUrl = 'https://graph.facebook.com';

  constructor(
    private readonly httpClient: HttpGetClient,
    private readonly clientId: string,
    private readonly clientSecret: string,
  ) { }

  async loadUser({ token }: LoadFacebookUserApi.Params): Promise<LoadFacebookUserApi.Result> {
    return this.getUserInfo(token)
      .then(({ id: facebookId, name, email }) => ({
        facebookId,
        name,
        email,
      })).catch(() => undefined);
  }

  private async getAppToken(): Promise<AppToken> {
    return this.httpClient.get<AppToken>({
      url: `${this.baseUrl}/oauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials',
      },
    });
  }

  private async getDebugToken(clientToken: string): Promise<DebugToken> {
    const { access_token } = await this.getAppToken();

    return this.httpClient.get<DebugToken>({
      url: `${this.baseUrl}/debug_token`,
      params: {
        access_token,
        input_token: clientToken,
      },
    });
  }

  private async getUserInfo(clientToken: string): Promise<any> {
    const { data: { user_id } } = await this.getDebugToken(clientToken);

    return this.httpClient.get({
      url: `${this.baseUrl}/${user_id}`,
      params: {
        fields: ['id', 'name', 'email'].join(','),
        access_token: clientToken,
      },
    });
  }
}
