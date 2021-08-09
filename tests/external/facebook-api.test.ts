import 'dotenv/config';
import { FacebookApi } from '@/infra/apis';
import { AxiosHttpClient } from '@/infra/http';
import { env } from '@/main/config/env';

describe('FacebookApi Integration Test', () => {
  let axiosClient: AxiosHttpClient;

  let sut: FacebookApi;

  beforeAll(() => {
    axiosClient = new AxiosHttpClient();
  });

  beforeEach(() => {
    sut = new FacebookApi(
      axiosClient,
      String(env.facebookApi.clientId),
      String(env.facebookApi.clientSecret),
    );
  });

  it('should return a Facebook User if token is valid', async () => {
    const fbUser = await sut.loadUser({
      token: String(env.facebookApi.tokenIntegration),
    });

    expect(fbUser).toEqual({
      facebookId: '100776375647612',
      email: 'marcos_fldovtk_teste@tfbnw.net',
      name: 'Marcos Teste',
    });
  });

  it('should return undefined if token is valid', async () => {
    const fbUser = await sut.loadUser({
      token: 'invalid_token',
    });

    expect(fbUser).toBeUndefined();
  });
});
