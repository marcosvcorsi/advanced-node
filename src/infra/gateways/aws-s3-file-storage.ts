import { S3 } from 'aws-sdk';

import { DeleteFile, UploadFile } from '@/domain/contracts/gateways';

export class AWSS3FileStorage implements UploadFile, DeleteFile {
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
    await this.s3.putObject({
      Bucket: this.bucket,
      Key: key,
      Body: file,
      ACL: 'public-read',
    }).promise();

    return `https://${this.bucket}.s3.amazonaws.com/${encodeURIComponent(key)}`;
  }

  async delete({ key }: DeleteFile.Params): DeleteFile.Result {
    await this.s3.deleteObject({
      Bucket: this.bucket,
      Key: key,
    }).promise();
  }
}
