import { S3 } from 'aws-sdk';

import { UploadFile } from '@/domain/contracts/gateways';

class AWSS3FileStorage implements UploadFile {
  private s3: S3;

  constructor(accessKeyId: string, secretAccessKey: string) {
    this.s3 = new S3({
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async upload(input: UploadFile.Params): UploadFile.Result {
    console.log(input);

    return '';
  }
}

jest.mock('aws-sdk');

describe('AWSS3FileStorage', () => {
  let accessKeyId: string;
  let secretAccessKey: string;

  let sut: AWSS3FileStorage;

  beforeAll(() => {
    accessKeyId = 'any_access_key_id';
    secretAccessKey = 'any_secret_access_key';
  });

  beforeEach(() => {
    sut = new AWSS3FileStorage(accessKeyId, secretAccessKey);
  });

  it('should set up aws config credentials', () => {
    expect(sut).toBeDefined();
    expect(S3).toHaveBeenCalledWith({
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  });
});
