import { InvalidMimeTypeError } from '@/application/errors';
import { AllowedMimeTypes } from '@/application/validation';

describe('AllowedMimeTypes', () => {
  let sut: AllowedMimeTypes;

  it('should return InvalidMimeTypeError if value is invalid', () => {
    sut = new AllowedMimeTypes(['png'], 'image/jpg');

    const error = sut.validate();

    expect(error).toEqual(new InvalidMimeTypeError(['png']));
  });

  it('should return undefined if value is valid for png', () => {
    sut = new AllowedMimeTypes(['png'], 'image/png');

    const error = sut.validate();

    expect(error).toBeUndefined();
  });

  it('should return undefined if value is valid for jpg', () => {
    sut = new AllowedMimeTypes(['jpg'], 'image/jpg');

    const error = sut.validate();

    expect(error).toBeUndefined();
  });

  it('should return undefined if value is valid for jpeg', () => {
    sut = new AllowedMimeTypes(['jpg'], 'image/jpeg');

    const error = sut.validate();

    expect(error).toBeUndefined();
  });
});
