import { AWSS3FileStorage } from '@/infra/gateways';
import { env } from '@/main/config/env';

export const makeAWS3FileStorage = (): AWSS3FileStorage => new AWSS3FileStorage(
  env.aws.accessKey,
  env.aws.secret,
  env.aws.bucket,
);
