import { Controller } from '@/application/controllers';
import { RequiredFieldError } from '@/application/errors';
import { badRequest, HttpResponse } from '@/application/helpers';

class InvalidMimeTypeError extends Error {
  constructor(allowed: string[]) {
    super(`Unsupported mime type. allowed: ${allowed.join(',')}`);

    this.name = 'InvalidMimeTypeError';
  }
}

type HttpRequest = {
  file: {
    buffer: Buffer;
    mimeType: string;
  };
}

type Response = Error;

class SaveProfilePictureController extends Controller {
  async perform({ file }: HttpRequest): Promise<HttpResponse<Response>> {
    if (!file?.buffer?.length) {
      return badRequest(new RequiredFieldError('file'));
    }

    if (!['image/jpg', 'image/jpeg', 'image/png'].includes(file.mimeType)) {
      return badRequest(new InvalidMimeTypeError(['jpg', 'jpeg', 'png']));
    }

    return {} as any;
  }
}

describe('SaveProfilePictureController', () => {
  let buffer: Buffer;
  // let mimeType: string;
  // let file: { buffer: Buffer };

  let sut: SaveProfilePictureController;

  beforeAll(() => {
    buffer = Buffer.from('any_file');
    // mimeType = 'image/png';

    // file = { buffer };
  });

  beforeEach(() => {
    sut = new SaveProfilePictureController();
  });

  it('should return 400 if file is not provided', async () => {
    const response = await sut.handle({ file: undefined });

    expect(response).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file'),
    });
  });

  it('should return 400 if file is not provided', async () => {
    const response = await sut.handle({ file: null });

    expect(response).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file'),
    });
  });

  it('should return 400 if file is empty', async () => {
    const response = await sut.handle({ file: { buffer: Buffer.from('') } });

    expect(response).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file'),
    });
  });

  it('should return 400 if file type is invalid', async () => {
    const response = await sut.handle({ file: { buffer, mimeType: 'invalid_type' } });

    expect(response).toEqual({
      statusCode: 400,
      data: new InvalidMimeTypeError(['jpg', 'jpeg', 'png']),
    });
  });

  it('should not return 400 if file type jpg', async () => {
    const response = await sut.handle({ file: { buffer, mimeType: 'image/jpg' } });

    expect(response).not.toEqual({
      statusCode: 400,
      data: new InvalidMimeTypeError(['jpg', 'jpeg', 'png']),
    });
  });

  it('should not return 400 if file type jpeg', async () => {
    const response = await sut.handle({ file: { buffer, mimeType: 'image/jpeg' } });

    expect(response).not.toEqual({
      statusCode: 400,
      data: new InvalidMimeTypeError(['jpg', 'jpeg', 'png']),
    });
  });

  it('should not return 400 if file type png', async () => {
    const response = await sut.handle({ file: { buffer, mimeType: 'image/png' } });

    expect(response).not.toEqual({
      statusCode: 400,
      data: new InvalidMimeTypeError(['jpg', 'jpeg', 'png']),
    });
  });
});
