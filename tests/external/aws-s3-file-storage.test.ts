import 'dotenv/config';

import axios from 'axios';

import { AWSS3FileStorage } from '@/infra/gateways';
import { env } from '@/main/config/env';

describe('AWS S3 Integration Test', () => {
  let sut: AWSS3FileStorage;
  let file: Buffer;

  beforeAll(() => {
    const base64img = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdjmC1S+R8ABJ4CKOftJjQAAAAASUVORK5CYII=';
    file = Buffer.from(base64img, 'base64');
  });

  beforeEach(() => {
    sut = new AWSS3FileStorage(
      env.aws.accessKey,
      env.aws.secret,
      env.aws.bucket,
    );
  });

  it('should upload and delete image from AWS S3', async () => {
    const filename = 'any_key.png';

    const pictureUrl = await sut.upload({ filename, file });

    const response = await axios.get(pictureUrl);

    expect(response.status).toBe(200);

    await sut.delete({ filename });

    await expect(axios.get(pictureUrl)).rejects.toThrow();
  });
});
