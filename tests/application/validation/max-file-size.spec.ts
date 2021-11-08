import { MaxFileSizeError } from '@/application/errors';
import { MaxFileSize } from '@/application/validation';

describe('MaxFileSize', () => {
  let sut: MaxFileSize;

  it('should return MaxFileSizeError if value is invalid', () => {
    sut = new MaxFileSize(5, Buffer.from(new ArrayBuffer(6 * 1024 * 1024)));

    const error = sut.validate();

    expect(error).toEqual(new MaxFileSizeError(5));
  });

  it('should return undefined if value is valid for file size', () => {
    sut = new MaxFileSize(5, Buffer.from(new ArrayBuffer(5 * 1024 * 1024)));

    const error = sut.validate();

    expect(error).toBeUndefined();
  });

  it('should return undefined if value is valid for file size', () => {
    sut = new MaxFileSize(5, Buffer.from(new ArrayBuffer(4 * 1024 * 1024)));

    const error = sut.validate();

    expect(error).toBeUndefined();
  });
});
