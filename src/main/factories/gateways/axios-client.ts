import { AxiosHttpClient } from '@/infra/gateways';

export const makeAxiosHttpClient = () => new AxiosHttpClient();
