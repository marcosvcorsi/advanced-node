import { S3 } from 'aws-sdk';
import { mocked } from 'ts-jest/utils';

import { AWSS3FileStorage } from '@/infra/gateways';

jest.mock('aws-sdk');

describe('AWSS3FileStorage', () => {
  let accessKeyId: string;
  let secretAccessKey: string;
  let bucket: string;
  let filename: string;

  let sut: AWSS3FileStorage;

  beforeAll(() => {
    accessKeyId = 'any_access_key_id';
    secretAccessKey = 'any_secret_access_key';
    bucket = 'any_bucket';
    filename = 'any_filename';
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

  describe('upload', () => {
    let file: Buffer;
    let putObjectSpy: jest.Mock;
    let putObjectPromiseSpy: jest.Mock;

    beforeAll(() => {
      file = Buffer.from('any_file');

      putObjectPromiseSpy = jest.fn();

      putObjectSpy = jest.fn().mockImplementation(() => ({
        promise: putObjectPromiseSpy,
      }));

      mocked(S3).mockImplementation(jest.fn().mockImplementation(() => ({
        putObject: putObjectSpy,
      })));
    });

    it('should call putObject with correct params', async () => {
      await sut.upload({ filename, file });

      expect(putObjectSpy).toHaveBeenCalledWith({
        Bucket: bucket,
        Key: filename,
        Body: file,
        ACL: 'public-read',
      });
      expect(putObjectSpy).toHaveBeenCalledTimes(1);
      expect(putObjectPromiseSpy).toHaveBeenCalledTimes(1);
    });

    it('should return a file URL', async () => {
      const result = await sut.upload({ filename, file });

      expect(result).toBe(`https://${bucket}.s3.amazonaws.com/${filename}`);
    });

    it('should return a encoded file URL', async () => {
      const result = await sut.upload({ filename: 'any filename', file });

      expect(result).toBe(`https://${bucket}.s3.amazonaws.com/any%20filename`);
    });

    it('should throws if putObject throws', async () => {
      putObjectPromiseSpy.mockRejectedValueOnce(new Error('any error'));

      await expect(sut.upload({ filename, file })).rejects.toThrow();
    });
  });

  describe('delete', () => {
    let deleteObjectSpy: jest.Mock;
    let deleteObjectPromiseSpy: jest.Mock;

    beforeAll(() => {
      deleteObjectPromiseSpy = jest.fn();

      deleteObjectSpy = jest.fn().mockImplementation(() => ({
        promise: deleteObjectPromiseSpy,
      }));

      mocked(S3).mockImplementation(jest.fn().mockImplementation(() => ({
        deleteObject: deleteObjectSpy,
      })));
    });

    it('should call deleteObject with correct params', async () => {
      await sut.delete({ filename });

      expect(deleteObjectSpy).toHaveBeenCalledWith({
        Bucket: bucket,
        Key: filename,
      });
      expect(deleteObjectSpy).toHaveBeenCalledTimes(1);
      expect(deleteObjectPromiseSpy).toHaveBeenCalledTimes(1);
    });

    it('should throws if deleteObject throws', async () => {
      deleteObjectPromiseSpy.mockRejectedValueOnce(new Error('any error'));

      await expect(sut.delete({ filename })).rejects.toThrow();
    });
  });
});
