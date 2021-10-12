import { S3 } from 'aws-sdk';
import { mocked } from 'ts-jest/utils';

import { UploadFile } from '@/domain/contracts/gateways';

class AWSS3FileStorage implements UploadFile {
  private s3: S3;

  constructor(
    accessKeyId: string,
    secretAccessKey: string,
    private readonly bucket: string,
  ) {
    this.s3 = new S3({
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async upload({ key, file }: UploadFile.Params): UploadFile.Result {
    this.s3.putObject({
      Bucket: this.bucket,
      Key: key,
      Body: file,
      ACL: 'public-read',
    }).promise();

    return '';
  }
}

jest.mock('aws-sdk');

describe('AWSS3FileStorage', () => {
  let accessKeyId: string;
  let secretAccessKey: string;
  let bucket: string;
  let key: string;
  let file: Buffer;
  let putObjectSpy: jest.Mock;
  let putObjectPromiseSpy: jest.Mock;

  let sut: AWSS3FileStorage;

  beforeAll(() => {
    accessKeyId = 'any_access_key_id';
    secretAccessKey = 'any_secret_access_key';
    bucket = 'any_bucket';
    key = 'any_key';
    file = Buffer.from('any_file');

    putObjectPromiseSpy = jest.fn();

    putObjectSpy = jest.fn().mockImplementation(() => ({
      promise: putObjectPromiseSpy,
    }));

    mocked(S3).mockImplementation(jest.fn().mockImplementation(() => ({
      putObject: putObjectSpy,
    })));
  });

  beforeEach(() => {
    sut = new AWSS3FileStorage(
      accessKeyId,
      secretAccessKey,
      bucket,
    );
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

  it('should call putObject with correct params', async () => {
    await sut.upload({ key, file });

    expect(putObjectSpy).toHaveBeenCalledWith({
      Bucket: bucket,
      Key: key,
      Body: file,
      ACL: 'public-read',
    });
    expect(putObjectSpy).toHaveBeenCalledTimes(1);
    expect(putObjectPromiseSpy).toHaveBeenCalledTimes(1);
  });
});
