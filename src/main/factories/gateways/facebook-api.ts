import { FacebookApi } from '@/infra/gateways';
import { env } from '@/main/config/env';
import { makeAxiosHttpClient } from '@/main/factories/gateways';

export const makeFacebookApi = (): FacebookApi => {
  const axiosHttpClient = makeAxiosHttpClient();

  const { clientId, clientSecret } = env.facebookApi;

  return new FacebookApi(
    axiosHttpClient,
    clientId,
    clientSecret,
  );
};
