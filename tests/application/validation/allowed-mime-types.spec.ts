import { InvalidMimeTypeError } from '@/application/errors';

type Extension = 'jpg' | 'jpeg' | 'png';

class AllowedMimeTypes {
  constructor(
    private readonly allowed: Extension[],
    private readonly mimeType: string,
  ) {}

  validate(): Error {
    return new InvalidMimeTypeError(this.allowed);
  }
}

describe('AllowedMimeTypes', () => {
  let sut: AllowedMimeTypes;

  it('should return InvalidMimeTypeError if value is invalid', () => {
    sut = new AllowedMimeTypes(['png'], 'image/png');

    const error = sut.validate();

    expect(error).toEqual(new InvalidMimeTypeError(['png']));
  });
});
